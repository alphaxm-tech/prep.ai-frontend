"use client";

export default function WorkInProgressBanner() {
  return (
    <div className="fixed top-[7.5rem] inset-x-0 bottom-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="mx-4 max-w-md rounded-2xl bg-white p-10 text-center shadow-2xl">
        <div className="mb-4 text-5xl">🚧</div>
        <h2 className="mb-2 text-2xl font-bold text-gray-900">
          Work in Progress
        </h2>
        <p className="text-gray-500">
          This feature is under development and will be launching soon. Stay
          tuned!
        </p>
      </div>
    </div>
  );
}
