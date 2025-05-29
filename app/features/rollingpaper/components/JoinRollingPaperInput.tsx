interface JoinRollingPaperInputProps {
  errorMessage?: string;
}

export function JoinRollingPaperInput({
  errorMessage,
}: JoinRollingPaperInputProps) {
  return (
    <>
      <form method="post" className="w-1/3 flex items-center mb-3">
        <input
          className="border-2 p-2 rounded-sm flex-1"
          placeholder="Join Code"
          name="joinCode"
          type="text"
        />
        <button
          className="border-2 p-2 rounded-sm ml-2 cursor-pointer hover:bg-gray-200"
          type="submit"
        >
          Join
        </button>
      </form>
      {errorMessage && <p className="text-red-500 mt-4">{errorMessage}</p>}
    </>
  );
}
