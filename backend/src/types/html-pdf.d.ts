declare module "html-pdf" {
  export interface CreateOptions {
    /** Page format */
    format?: string;
    /** Page orientation */
    orientation?: "portrait" | "landscape";
    /** Page borders */
    border?: {
      top?: string;
      right?: string;
      bottom?: string;
      left?: string;
    };
    /** PDF Header */
    header?: {
      height?: string;
      contents?: string;
    };
    /** PDF Footer */
    footer?: {
      height?: string;
      contents?: string;
    };
    /** Rendering timeout */
    timeout?: number;
    /** Zooming option */
    zoomFactor?: number;
    /** Type of PDF */
    type?: string;
    /** Quality of PDF */
    quality?: string;
    /** Height of page */
    height?: string;
    /** Width of page */
    width?: string;
    /** Header template file path */
    headerTemplate?: string;
    /** Footer template file path */
    footerTemplate?: string;
    /** PDF options */
    pdfOptions?: any;
    /** Base directory for phantom js */
    base?: string;
  }

  export interface CreateResult {
    filename: string;
  }

  export function create(
    html: string,
    options?: CreateOptions
  ): {
    toFile: (
      filename: string,
      callback: (err: Error, result: CreateResult) => void
    ) => void;
    toBuffer: (callback: (err: Error, buffer: Buffer) => void) => void;
    toStream: (
      callback: (err: Error, stream: NodeJS.ReadableStream) => void
    ) => void;
  };

  export default {
    create,
  };
}
