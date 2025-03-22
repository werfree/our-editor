import React, { useState } from "react";
import Snackbar from "@material-ui/core/Snackbar";
import HeaderButton from "./HeaderButton";

function ShareButton({ props }) {
  const [snack, setSnack] = useState(false);

  const copyToClipBoard = () => {
    const textToCopy = props.link;
    if (navigator.clipboard && window.isSecureContext) {
      // navigator clipboard api method'
      navigator.clipboard.writeText(props.link);
      setSnack(true);
      setTimeout(() => {
        setSnack(false);
      }, 3000);
      return navigator.clipboard.writeText(textToCopy);
    } else {
      // text area method
      let textArea = document.createElement("textarea");
      textArea.value = textToCopy;
      // make the textarea out of viewport
      textArea.style.position = "fixed";
      textArea.style.left = "-999999px";
      textArea.style.top = "-999999px";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      setSnack(true);
      setTimeout(() => {
        setSnack(false);
      }, 3000);
      return new Promise((res, rej) => {
        // here the magic happens
        document.execCommand("copy") ? res() : rej();
        textArea.remove();
      });
    }
  };
  return (
    <>
      <HeaderButton action={copyToClipBoard}>
        <span>Share</span>
      </HeaderButton>

      <Snackbar open={snack} message="Link Copied" />
    </>
  );
}

export default ShareButton;
