import React from "react";
import Typewriter from "typewriter-effect";

export default function Jumbotron({ textArray }) {
  return (
    <Typewriter
      options={{
        strings: textArray,
        autoStart: true,
        loop: true,
      }}
    />
  );
}
