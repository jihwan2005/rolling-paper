import { Textbox, FabricImage, Path } from "fabric";

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

export interface CustomPath extends Path {
  PathNodeId?: string;
  profile_id?: string;
  username?: string;
  canvasIndex?: number;
}

export interface CustomAudio extends FabricImage {
  AudioNodeId?: string;
  profile_id?: string;
  username?: string;
  canvasIndex?: number;
}
