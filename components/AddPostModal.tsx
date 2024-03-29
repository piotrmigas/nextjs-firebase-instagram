import { Fragment, useRef, useState, ChangeEvent } from 'react';
import { Transition, Dialog } from '@headlessui/react';
import { CameraIcon } from '@heroicons/react/outline';
import { addDoc, collection, serverTimestamp, updateDoc, doc } from '@firebase/firestore';
import { useSession } from 'next-auth/react';
import { getDownloadURL, ref, uploadString } from '@firebase/storage';
import { storage, db } from '../firebase';

type Props = {
  open: boolean;
  setOpen: (value: boolean) => void;
};

export default function AddPostModal({ open, setOpen }: Props) {
  const { data: session } = useSession();

  const filePickerRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const captionRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);

  const uploadPost = async () => {
    if (loading) return;
    setLoading(true);

    const docRef = await addDoc(collection(db, 'posts'), {
      username: session.user.username,
      caption: captionRef?.current?.value,
      profileImg: session.user.image,
      timestamp: serverTimestamp(),
    });

    const imageRef = ref(storage, `posts/${docRef.id}/image`);
    if (selectedFile) {
      await uploadString(imageRef, selectedFile, 'data_url').then(async () => {
        const downloadUrl = await getDownloadURL(imageRef);
        await updateDoc(doc(db, 'posts', docRef.id), {
          image: downloadUrl,
        });
      });
    }
    setOpen(false);
    setLoading(false);
    setSelectedFile(null);
  };

  const addImgToPost = (e: ChangeEvent<HTMLInputElement>) => {
    const reader = new FileReader();
    if (e.target.files) {
      reader.readAsDataURL(e.target.files[0]);
    }

    reader.onload = (rendeEvent) => {
      setSelectedFile(rendeEvent.target?.result as string);
    };
  };

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as='div' className='fixed z-10 inset-0 overflow-y-auto' onClose={setOpen}>
        <div className='flex items-end justify-center min-h-[800px] sm:min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0'>
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
          <span className='hidden sm:inline-block sm:align-middle sm:h-screen' aria-hidden='true'>
            &#803;
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
            <div className='inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-sm sm:w-full sm:p-6'>
              <div>
                {selectedFile ? (
                  <img
                    onClick={() => setSelectedFile(null)}
                    src={selectedFile}
                    alt=''
                    className='w-full object-contain cursor-pointer'
                  />
                ) : (
                  <div
                    onClick={() => filePickerRef?.current?.click()}
                    className='mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 cursor-pointer'
                  >
                    <CameraIcon className='h-6 w-6 text-red-600' aria-hidden='true' />
                  </div>
                )}
                <div>
                  <div className='mt-3 text-center sm:mt-5'>
                    <Dialog.Title as='h3' className='text-lg leading-6 font-medium text-gray-900'>
                      Upload a photo
                    </Dialog.Title>
                    <div>
                      <input type='file' hidden ref={filePickerRef} onChange={addImgToPost} />
                    </div>
                    <div className='mt-2'>
                      <input
                        ref={captionRef}
                        type='text'
                        className='border-none focus:ring-0 w-full text-center'
                        placeholder='Please enter a caption...'
                      />
                    </div>
                  </div>
                </div>
                <div className='mt-5 sm:mt-6'>
                  <button
                    onClick={uploadPost}
                    disabled={!selectedFile}
                    type='button'
                    className='inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white focus:outline-none sm:text-sm disabled:bg-gray-300 disabled:cursor-not-allowed'
                  >
                    {loading ? 'Uploading...' : 'Upload Post'}
                  </button>
                </div>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
