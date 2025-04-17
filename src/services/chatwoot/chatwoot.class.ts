import { readFile } from "fs/promises";
import fetch from "node-fetch";
import FormData from "form-data";
import mime from "mime-types";

class ChatwootClass {
  config: { account?: string; token?: string; endpoint?: string };

  constructor(_config: { account?: string; token?: string; endpoint?: string } = {}) {
    if (!_config?.account) throw new Error("ACCOUNT_ERROR");
    if (!_config?.token) throw new Error("TOKEN_ERROR");
    if (!_config?.endpoint) throw new Error("ENDPOINT_ERROR");
    this.config = _config;
  }

  formatNumber = (number: any) => (!number.startsWith("+") ? `+${number}` : number);

  buildHeader = () => {
    const headers = new Headers();
    headers.append("api_access_token", this.config.token);
    headers.append("Content-Type", "application/json");
    return headers;
  };

  buildBaseUrl = (path: string) => `${this.config.endpoint}/api/v1/accounts/${this.config.account}${path}`;

  findContact = async (from: string) => {
    try {
      const url = this.buildBaseUrl(`/contacts/search?q=${from}`);
      const dataFetch = await fetch(url, { headers: this.buildHeader(), method: "GET" });
      const data = await dataFetch.json() as { payload: any[] };
      return data.payload[0];
    } catch (error) {
      console.error(`[Error searchByNumber]`, error);
      return [];
    }
  };

  createContact = async (dataIn = { from: "", name: "", inbox: "" }) => {
    try {
      dataIn.from = this.formatNumber(dataIn.from);
      const data = { inbox_id: dataIn.inbox, name: dataIn.name, phone_number: dataIn.from };
      const url = this.buildBaseUrl(`/contacts`);
      const dataFetch = await fetch(url, { headers: this.buildHeader(), method: "POST", body: JSON.stringify(data) });
      const response = await dataFetch.json() as { payload: any };
      return response.payload.contact;
    } catch (error) {
      console.error(`[Error createContact]`, error);
      return;
    }
  };

  findOrCreateContact = async (dataIn: any = { from: "", name: "", inbox: "" }) => {
    try {
      dataIn.from = this.formatNumber(dataIn.from);
      const getContact = await this.findContact(dataIn.from);
      return getContact || await this.createContact(dataIn);
    } catch (error) {
      console.error(`[Error findOrCreateContact]`, error);
      return;
    }
  };

  createConversation = async (dataIn: { inbox_id: string; contact_id: string; phone_number: string }) => {
    try {
      const payload = {
        source_id: dataIn.phone_number,
        inbox_id: dataIn.inbox_id,
        contact_id: dataIn.contact_id,
        custom_attributes: { phone_number: dataIn.phone_number },
      };
      const url = this.buildBaseUrl(`/conversations`);
      const response = await fetch(url, { method: "POST", headers: this.buildHeader(), body: JSON.stringify(payload) });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}`);
      return await response.json();
    } catch (error) {
      console.error(`[Error createConversation]`, error.message);
      return null;
    }
  };

 public getOpenConversation = async (dataIn: { contact_id: string }) => {
  try {
    const url = this.buildBaseUrl(`/contacts/${dataIn.contact_id}/conversations`);
    const response = await fetch(url, {
      method: "GET",
      headers: this.buildHeader(),
    });

    const result = await response.json();

    if (!Array.isArray((result as any).payload)) return null;

    const openConversation = (result as any).payload.find(
      (c: any) => c.status === "open"
    );

    return openConversation || null;
  } catch (error) {
    console.error("[Error getOpenConversation]", error);
    return null;
  }
};

  setCustomAttributes = async () => {
    try {
      const url = this.buildBaseUrl(`/custom_attribute_definitions`);
      const attribute = {
        attribute_display_name: "phone_number",
        attribute_display_type: 1,
        attribute_description: "phone_number",
        attribute_key: "phone_number",
        attribute_values: [""],
        attribute_model: 0,
      };
      const response = await fetch(url, {
        method: "POST",
        headers: this.buildHeader(),
        body: JSON.stringify(attribute),
      });
      return await response.json();
    } catch (error) {
      console.error(`[Error setCustomAttributes]`, error);
      return [];
    }
  };

  getAttributes = async () => {
    try {
      const url = this.buildBaseUrl(`/custom_attribute_definitions`);
      const dataFetch = await fetch(url, { headers: this.buildHeader(), method: "GET" });
      return await dataFetch.json();
    } catch (error) {
      console.error(`[Error getAttributes]`, error);
      return [];
    }
  };

  checkAndSetCustomAttribute = async () => {
    try {
      const existingAttributes: any[] = await this.getAttributes() as any[];
      const attributeExists = existingAttributes.some(attr => attr.attribute_key === "phone_number");
      if (!attributeExists) await this.setCustomAttributes();
    } catch (error) {
      console.error(`[Error checkAndSetCustomAttribute]`, error);
    }
  };

  findConversation = async (dataIn: { phone_number: string; inbox_id: string }) => {
    try {
      const payload = [
        { attribute_key: "phone_number", filter_operator: "equal_to", values: [dataIn.phone_number], query_operator: "AND" },
        { attribute_key: "inbox_id", filter_operator: "equal_to", values: [dataIn.inbox_id] },
      ];
      const url = this.buildBaseUrl(`/conversations/filter`);
      const response = await fetch(url, { method: "POST", headers: this.buildHeader(), body: JSON.stringify({ payload }) });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}`);
      const data = await response.json() as { payload: any[] };
      return data.payload;
    } catch (error) {
      console.error(`[Error findConversation]`, error.message);
      return null;
    }
  };

  findOrCreateConversation = async (dataIn: { inbox_id: string; contact_id: string; phone_number: string }) => {
    try {
      dataIn.phone_number = this.formatNumber(dataIn.phone_number);
      const conversation = await this.findConversation(dataIn);
      return !conversation.length ? await this.createConversation(dataIn) : conversation[0];
    } catch (error) {
      console.error(`[Error findOrCreateConversation]`, error.message);
      return null;
    }
  };

  public createMessage = async (dataIn = { msg: "", mode: "", conversation_id: "", attachment: [] }): Promise<any> => {
    try {
      const url = this.buildBaseUrl(`/conversations/${dataIn.conversation_id}/messages`);
      const form = new FormData();
      form.append("content", dataIn.msg);
      form.append("message_type", dataIn.mode);
      form.append("private", "true");
      if (dataIn.attachment?.length) {
        const mimeType = mime.lookup(dataIn.attachment[0]) as string;
        const fileName = `${dataIn.attachment[0]}`.split("/").pop()!;
        const fileBuffer = await readFile(dataIn.attachment[0]);
        form.append("attachments[]", fileBuffer, { filename: fileName, contentType: mimeType });
      }
      const dataFetch = await fetch(url, { method: "POST", headers: { api_access_token: this.config.token }, body: form });
      return await dataFetch.json();
    } catch (error) {
      console.error(`[Error createMessage]`, error);
      return;
    }
  };

  createInbox = async (dataIn = { name: "" }) => {
    try {
      const payload = { name: dataIn.name, channel: { type: "api", webhook_url: "" } };
      const url = this.buildBaseUrl(`/inboxes`);
      const dataFetch = await fetch(url, { headers: this.buildHeader(), method: "POST", body: JSON.stringify(payload) });
      return await dataFetch.json();
    } catch (error) {
      console.error(`[Error createInbox]`, error);
      return;
    }
  };

  findInbox = async (dataIn = { name: "" }) => {
    try {
      const url = this.buildBaseUrl(`/inboxes`);
      const dataFetch = await fetch(url, { headers: this.buildHeader(), method: "GET" });
      const data = await dataFetch.json() as { payload: any };
      return data.payload.find((o: { name: string }) => o.name === dataIn.name);
    } catch (error) {
      console.error(`[Error findInbox]`, error);
      return;
    }
  };

  findOrCreateInbox = async (dataIn = { name: "" }) => {
    try {
      const getInbox = await this.findInbox(dataIn);
      return getInbox || await this.createInbox(dataIn);
    } catch (error) {
      console.error(`[Error findOrCreateInbox]`, error);
      return;
    }
  };
}

export { ChatwootClass };
