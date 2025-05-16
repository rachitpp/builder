declare module "react-hot-toast" {
  export interface Toast {
    id: string;
    type: "success" | "error" | "loading" | "blank";
    message: string;
    icon?: React.ReactNode;
    duration?: number;
    position?: string;
  }

  export interface ToastOptions {
    id?: string;
    icon?: React.ReactNode;
    duration?: number;
    position?: string;
    style?: React.CSSProperties;
    className?: string;
  }

  export function toast(message: string, options?: ToastOptions): string;

  export namespace toast {
    function success(message: string, options?: ToastOptions): string;
    function error(message: string, options?: ToastOptions): string;
    function loading(message: string, options?: ToastOptions): string;
    function custom(message: React.ReactNode, options?: ToastOptions): string;
    function dismiss(toastId?: string): void;
    function remove(toastId: string): void;
  }

  export function useToaster(): {
    toasts: Toast[];
    handlers: {
      startPause: () => void;
      endPause: () => void;
      updateHeight: (toastId: string, height: number) => void;
      updateToast: (toast: Toast) => void;
    };
  };

  export interface ToasterProps {
    position?:
      | "top-left"
      | "top-center"
      | "top-right"
      | "bottom-left"
      | "bottom-center"
      | "bottom-right";
    toastOptions?: ToastOptions;
    reverseOrder?: boolean;
    gutter?: number;
    containerStyle?: React.CSSProperties;
    containerClassName?: string;
    children?: (toast: Toast) => React.ReactNode;
  }

  export function Toaster(props?: ToasterProps): JSX.Element;

  export default toast;
}
