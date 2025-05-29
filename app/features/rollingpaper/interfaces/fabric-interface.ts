import { Textbox, FabricImage } from "fabric";

export interface CustomTextbox extends Textbox {
  textNodeId?: string;
  profile_id?: string;
  username?: string;
  canvasIndex?: number;
}

export interface CustomImage extends FabricImage {
  imageNodeId?: string;
  profile_id?: string;
  username?: string;
  canvasIndex?: number;
}
