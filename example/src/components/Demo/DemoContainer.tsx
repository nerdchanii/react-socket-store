import React, { useCallback, useContext, useEffect, useState } from "react";
import DemoPresenter from "./DemoPresenter";
import { useSocket } from "react-socket-store";
type Props = {};

const DemoContainer = (props: Props) => {
  const [state, send] = useSocket("talk");

  useEffect(() => {
    console.log("App rendered");
  }, []);

  const submit = (message: string) => {
    send(message);
  };

  return (
    <>
      <h2 className="text-lg p-2  text-center dark:text-slate-50">Demo</h2>
      <DemoPresenter submit={submit} conversations={state} />
    </>
  );
};

export default DemoContainer;
