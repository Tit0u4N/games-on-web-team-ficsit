import React from 'react';
import { Code, Image, Link } from '@nextui-org/react';

type Props = {
  image: string;
  name: string;
  githubName: string;
  github: string;
};

export const AvatarCredit: React.FC<Props> = ({ name, image, githubName, github }) => {
  return (
    <div className={'flex flex-col justify-center items-center w-full'}>
      <Image
        src={image}
        alt={'Profile image of ' + name}
        width={100}
        height={100}
        className={'size-[100px] m-auto rounded-full fit-cover'}
      />
      <Link
        href={github}
        color={'foreground'}
        underline={'hover'}
        target="_blank"
        rel="noopener noreferrer"
        isExternal={true}
        showAnchorIcon={true}
        className={'text-xl pb-1'}>
        {githubName}
      </Link>
      <Code className={'select-none text-xs'}>{name}</Code>
    </div>
  );
};
