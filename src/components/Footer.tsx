import React from 'react';
import Image from 'next/image';

const Footer: React.FC = () => {
  return (
    <footer>
      <div className="flex justify-between items-center mt-2">
        <div >
          <Image
            src="/bleft_img.svg"
            alt="Logo 1"
            width={96}
            height={96}
            className="mt-8 md:w-[170px] md:h-[170px]"
          />
        </div>
        <div >
          <Image
            src="/bright_img.svg"
            alt="Logo 2"
            width={115}
            height={115}
            className='mt-8 md:w-[170px] md:h-[170px]'
          />
        </div>
      </div>
    </footer>
  );
};

export default Footer;
