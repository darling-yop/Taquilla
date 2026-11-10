import Link from "next/link";
import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  MouseEventHandler,
  ReactNode,
  Ref,
} from "react";
import "./Button.css";

type ButtonVariant = "primary" | "outline" | "link" | "icon";

type ButtonProps =
  | (ButtonHTMLAttributes<HTMLButtonElement> & {
      variant: Exclude<ButtonVariant, "link">;
      buttonRef?: Ref<HTMLButtonElement>;
    })
  | (Omit<
      AnchorHTMLAttributes<HTMLAnchorElement>,
      "href" | "onClick" | "children"
    > & {
      variant: "link";
      href: string;
      children: ReactNode;
      onClick?: MouseEventHandler<HTMLAnchorElement>;
    });

export default function Button(props: ButtonProps) {
  if (props.variant === "link") {
    const { variant, href, className = "", children, ...linkProps } = props;
    return (
      <Link
        {...linkProps}
        href={href}
        className={`ui-button ui-button--${variant} ${className}`.trim()}
      >
        {children}
        <span className="ui-button-arrow" aria-hidden="true">
          →
        </span>
      </Link>
    );
  }

  const {
    variant,
    buttonRef,
    className = "",
    type = "button",
    ...buttonProps
  } = props;
  return (
    <button
      {...buttonProps}
      ref={buttonRef}
      type={type}
      className={`ui-button ui-button--${variant} ${className}`.trim()}
    />
  );
}
