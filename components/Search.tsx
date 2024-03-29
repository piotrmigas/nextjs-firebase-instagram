import { useEffect } from 'react';
import { SearchIcon } from '@heroicons/react/outline';
import { useDispatch, useSelector } from 'react-redux';
import { filterPosts, setSearchTerm } from '../redux/postSlice';
import { selectSearchTerm } from '../redux/postSlice';

export default function Search() {
  const dispatch = useDispatch();
  const searchTerm = useSelector(selectSearchTerm);

  useEffect(() => {
    dispatch(filterPosts(searchTerm));
  }, [searchTerm, dispatch]);

  return (
    <div className='max-w-xs'>
      <div className='relative mt-1 p-3 rounded-md'>
        <div className='absolute inset-y-0 pl-3 flex items-center pointer-events-none'>
          <SearchIcon className='h-5 w-5 text-gray-500' />
        </div>
        <input
          type='text'
          placeholder='Search'
          className='bg-gray-50 block w-full pl-10 sm:text-sm border-gray-300 focus:ring-0 focus:border-gray-300 rounded-md'
          onChange={(e) => dispatch(setSearchTerm(e.target.value))}
        />
      </div>
    </div>
  );
}
