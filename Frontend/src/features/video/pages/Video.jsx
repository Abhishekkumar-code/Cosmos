
import * as React from "react";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";

function randomID(len = 8) {
  const chars =
    "12345qwertyuiopasdfgh67890jklmnbvcxzMNBVCZXASDQWERTYHGFUIOLKJP";

  let result = "";

  for (let i = 0; i < len; i++) {
    result += chars.charAt(
      Math.floor(Math.random() * chars.length)
    );
  }

  return result;
}

export default function App() {
  const [roomID] = React.useState(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get("roomID") || randomID(5);
  });

  const containerRef = React.useRef(null);

  React.useEffect(() => {
    const appID =1365919773;
    const serverSecret = "89e8f6db1e228301d6322a9f91080a1f";

    const userID = randomID(8);
    const userName = "Abhishek";

    const kitToken =
      ZegoUIKitPrebuilt.generateKitTokenForTest(
        appID,
        serverSecret,
        roomID,
        userID,
        userName
      );

    const zp = ZegoUIKitPrebuilt.create(kitToken);

    zp.joinRoom({
      container: containerRef.current,

      sharedLinks: [
        {
          name: "Personal link",
          url:
            window.location.origin +
            window.location.pathname +
            "?roomID=" +
            roomID,
        },
      ],

      scenario: {
        mode: ZegoUIKitPrebuilt.GroupCall,
      },
    });

    return () => {
      zp.destroy();
    };
  }, [roomID]);

  return (
    <div
      ref={containerRef}
      style={{ width: "100vw", height: "100vh" }}
    />
  );
}
