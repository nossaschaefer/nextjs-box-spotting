export default function ConfirmModal({ onConfirm, onClose }) {
  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-md w-1/2">
        <h2 className="text-sm text-center mb-4">
          Are you sure you want to delete this box?
        </h2>
        <div className="flex justify-around">
          <button
            onClick={onConfirm}
            className="bg-red-500 text-white px-4 py-2 rounded-md"
          >
            Yes
          </button>
          <button
            onClick={onClose}
            className="bg-gray-500 text-white px-4 py-2 rounded-md"
          >
            No
          </button>
        </div>
      </div>
    </div>
  );
}
