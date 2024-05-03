import React from 'react';
import { Code, Image, Link } from '@nextui-org/react';

type Props = {
  image: string;
  name: string;
  githubUser: string;
  github?: string;
};

export const AvatarCredit: React.FC<Props> = ({ name, image, githubUser, github }) => {
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
        href={github || 'https://github.com/' + githubUser}
        color={'foreground'}
        underline={'hover'}
        target="_blank"
        rel="noopener noreferrer"
        isExternal={true}
        showAnchorIcon={true}
        className={'text-xl pb-1'}>
        {githubUser}
      </Link>
      <Code className={'select-none text-xs'}>{name}</Code>
    </div>
  );
};
