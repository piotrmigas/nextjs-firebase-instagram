import { useRef, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { deleteDoc, doc } from '@firebase/firestore';
import { db } from '../firebase';
import { useSession } from 'next-auth/react';

type Props = {
  open: boolean;
  setOpen: (value: boolean) => void;
  id: string;
  username: string;
  setEditing: (value: boolean) => void;
};

export default function PostModal({ open, setOpen, id, username, setEditing }: Props) {
  const deletePost = async () => {
    await deleteDoc(doc(db, 'posts', id));
    setOpen(false);
  };

  const { data: session } = useSession();

  const delBtnRef = useRef(null);
  const editBtnRef = useRef(null);

  return (
    <Transition appear show={open} as={Fragment}>
      <Dialog as='div' open={open} onClose={setOpen} className='fixed inset-0 z-10 overflow-y-auto'>
        <div className='min-h-screen px-4 text-center'>
          <Transition.Child
            as={Fragment}
            enter='ease-out duration-300'
            enterFrom='opacity-0'
            enterTo='opacity-100'
            leave='ease-in duration-200'
            leaveFrom='opacity-100'
            leaveTo='opacity-0'
          >
            <Dialog.Overlay className='fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity' />
          </Transition.Child>
          {/* Centrowanie modala */}
          <span className='inline-block h-screen align-middle' aria-hidden='true'>
            &#8203;
          </span>
          <Transition.Child
            as={Fragment}
            enter='ease-out duration-300'
            enterFrom='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
            enterTo='opacity-100 translate-y-0 sm:scale-100'
            leave='ease-in duration-200'
            leaveFrom='opacity-100 translate-y-0 sm:scale-100'
            leaveTo='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
          >
            <div className='inline-block align-bottom bg-white rounded-lg shadow-xl transform transition-all sm:align-middle sm:max-w-sm sm:w-full'>
              <button
                disabled={session?.user?.username !== username}
                ref={delBtnRef}
                type='button'
                className='inline-flex justify-center py-2 text-base font-medium w-full rounded-t-lg focus:outline-none sm:text-sm disabled:cursor-not-allowed text-red-500 border-b border-gray-300'
                onClick={deletePost}
              >
                Delete
              </button>
              <button
                disabled={session?.user?.username !== username}
                ref={editBtnRef}
                type='button'
                className='inline-flex justify-center py-2 text-base font-medium w-full rounded-lg focus:outline-none sm:text-sm disabled:cursor-not-allowed'
                onClick={() => {
                  setEditing(true);
                  setOpen(false);
                }}
              >
                Edit
              </button>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
}
