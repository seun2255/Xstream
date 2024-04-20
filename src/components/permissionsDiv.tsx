import React, { useContext, useEffect, useRef, useState } from "react";
import Navbar from "@/components/Navbar";
import Context from "../contexts/context";
import CameraOff from "@mui/icons-material/NoPhotography";
import { useEventListener } from "@huddle01/react/hooks";
import {
  useLobby,
  useAudio,
  useVideo,
  usePeers,
  useRoom,
} from "@huddle01/react/hooks";
import ToggleButton from "@/components/ToggleButton";
import { useRouter } from "next/router";
import ImageIcon from "@mui/icons-material/Image";
import Image from "next/image";
import PrimaryButton from "@/components/PrimaryButton";
import { useSignerContext } from "@/contexts/signerContext";
import Router from "next/router";
import LoadingModal from "@/components/LoadingModal";
import { NFTStorage, File, Blob } from "nft.storage";
import { useStreamContext } from "@/contexts/streamContext";

interface LobbyProps {
  setRoomJoined: any;
}

const RoomLobby: React.FC<LobbyProps> = ({ setRoomJoined }) => {
  const context: any = useContext(Context);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { joinRoom, leaveRoom, isRoomJoined } = useRoom();
  const { joinLobby, leaveLobby, isLoading, isLobbyJoined, error } = useLobby();
  const [cameraOn, setCamera] = useState<boolean>(false);
  const [micOn, setMic] = useState<boolean>(false);
  const [isExclusive, setIsExclusive] = useState<boolean>(false);
  const {
    fetchVideoStream,
    stopVideoStream,
    stream: camStream,
    error: camError,
  } = useVideo();
  const {
    fetchAudioStream,
    stopAudioStream,
    stream: micStream,
    error: micError,
  } = useAudio();
  const { isHost, streamId } = useStreamContext();
  const router = useRouter();

  useEffect(() => {
    if (camStream && videoRef.current) {
      videoRef.current.srcObject = camStream;
    }
  }, [camStream]);

  const joinStream = async () => {
    context.setLoading(true);
    joinRoom();
    context.setLoading(false);
    setRoomJoined(true);
  };

  return (
    <div className="bg flex flex-col justify-start items-center scrollbar-hidden content">
      <Navbar isSticky={true}></Navbar>
      <LoadingModal isOpen={context.loading}></LoadingModal>
      <div className="w-full h-[10vh]"></div>
      <div className="h-auto w-[90%] flex mt-10 flex-row justify-between items-start px-10 mb-10">
        <div className="h-[80vh] flex flex-col justify-start items-start">
          <div className="flex flex-row justify-start items-center">
            <span
              className="text-white font-rubik font-semibold text-[1.2rem] ml-2"
              onClick={() => {
                console.log(micOn, cameraOn);
              }}
            >
              Room ID :{" "}
            </span>
            <span className="text-textRed font-rubik font-semibold text-[1.2rem] ml-2">
              {router.query.roomId}
            </span>
          </div>
          <div className="w-full h-80 aspect-video bg-secondaryRed/10 border-solid border-[1px] border-primaryRed rounded-xl relative overflow-hidden mt-4 border-shadow">
            {!cameraOn ? (
              <div className="absolute h-full w-full flex flex-col justify-center items-center">
                <CameraOff
                  style={{
                    fontSize: 100,
                    color: "white",
                    marginBottom: "5rem",
                  }}
                ></CameraOff>
              </div>
            ) : (
              <video
                ref={videoRef}
                autoPlay
                muted
                className="object-contain absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
              />
            )}
            <div className="absolute w-[30%] left-[35%] bottom-4 flex flex-row justify-between items-center">
              <ToggleButton
                h="h-[3rem]"
                w="w-[3rem]"
                disabled={!cameraOn}
                action={() => {
                  if (cameraOn == false) {
                    fetchVideoStream();
                    setCamera(!cameraOn);
                  } else {
                    stopVideoStream();
                    setCamera(!cameraOn);
                  }
                }}
                type="camera"
              ></ToggleButton>
              <ToggleButton
                h="h-[3rem]"
                w="w-[3rem]"
                disabled={!micOn}
                action={() => {
                  if (micOn == false) {
                    fetchAudioStream();
                    setMic(!micOn);
                  } else {
                    stopAudioStream();
                    setMic(!micOn);
                  }
                }}
                type="mic"
              ></ToggleButton>
            </div>
          </div>
        </div>
        <div className="w-[50%] h-auto flex flex-col justify-start items-start">
          <div className="w-full flex flex-row justify-between items-center mt-8">
            <PrimaryButton
              h="h-[3.5rem]"
              w="w-[15rem]"
              textSize="text-[1.2rem]"
              label="JOIN STREAM"
              action={() => {
                joinStream();
              }}
              disabled={false}
            ></PrimaryButton>
            <PrimaryButton
              h="h-[3.5rem]"
              w="w-[15rem]"
              textSize="text-[1.2rem]"
              label="LEAVE LOBBY"
              action={() => {
                router.push("/home");
              }}
              disabled={false}
            ></PrimaryButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomLobby;
