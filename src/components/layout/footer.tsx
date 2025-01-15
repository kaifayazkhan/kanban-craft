import React from 'react';

export default function Footer() {
  return (
    <footer className='bg-white py-8'>
      <div className='container'>
        <div className='flex flex-col items-center justify-between gap-4 md:flex-row'>
          <div className='text-xl font-semibold'>Kanban Craft</div>
          <p>Copyright 2023. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
}
