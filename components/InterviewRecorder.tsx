"use client";

import React, { useState, useRef } from "react";

interface Props {
  questionId: number;
  onComplete: () => void;
}

export default function InterviewRecorder({ questionId, onComplete }: Props) {
  const [recording, setRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunks = useRef<Blob[]>([]);

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

    const recorder = new MediaRecorder(stream);
    mediaRecorderRef.current = recorder;

    recorder.ondataavailable = (e) => chunks.current.push(e.data);

    recorder.onstop = async () => {
      const blob = new Blob(chunks.current, { type: "audio/webm" });
      const url = URL.createObjectURL(blob);
      setAudioUrl(url);

      // Upload recorded answer to backend
      await uploadAudio(blob);

      chunks.current = [];
      onComplete();
    };

    recorder.start();
    setRecording(true);
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setRecording(false);
  };

  const uploadAudio = async (blob: Blob) => {
    const formData = new FormData();
    formData.append("audio", blob);
    formData.append("questionId", questionId.toString());

    await fetch("/api/upload-audio", {
      method: "POST",
      body: formData,
    });
  };

  return (
    <div className="mt-6 flex flex-col items-center space-y-4">
      {/* Timer */}
      {recording && (
        <div className="text-red-500 font-semibold animate-pulse">
          Recording...
        </div>
      )}

      {/* Buttons */}
      {!recording ? (
        <button
          onClick={startRecording}
          className="px-6 py-3 bg-green-600 text-white rounded-full hover:bg-green-700"
        >
          🎤 Start Answering
        </button>
      ) : (
        <button
          onClick={stopRecording}
          className="px-6 py-3 bg-red-600 text-white rounded-full hover:bg-red-700"
        >
          ⏹ Stop Answering
        </button>
      )}

      {/* Playback after recording */}
      {audioUrl && <audio controls src={audioUrl} className="w-full mt-4" />}
    </div>
  );
}
