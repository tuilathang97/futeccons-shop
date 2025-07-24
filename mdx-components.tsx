import React, { ComponentPropsWithoutRef } from 'react';
import Link from 'next/link';
import "./src/app/(frontend)/globals.css";
import Image, { ImageProps } from 'next/image';
import MDXNewsSchema from '@/components/seo/MDXNewsSchema';

type HeadingProps = ComponentPropsWithoutRef<'h1'>;
type ParagraphProps = ComponentPropsWithoutRef<'p'>;
type ListProps = ComponentPropsWithoutRef<'ul'>;
type ListItemProps = ComponentPropsWithoutRef<'li'>;
type AnchorProps = ComponentPropsWithoutRef<'a'>;
type BlockquoteProps = ComponentPropsWithoutRef<'blockquote'>;

const components = {
  img: (props: ImageProps) => {
    if(props.alt !== "" && props.src !== "") {
      return (
        <Image 
            className='rounded-lg object-cover min-w-full h-auto  aspect-video' 
            src={props?.src || ''} 
            alt={props?.alt || 'image'} 
            width={800}
            height={400}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
      );
    }
  },
  h1: (props: HeadingProps) => (
    <h1 className="font-semibold md:text-2xl text-xl leading-8" {...props} />
  ),
  h2: (props: HeadingProps) => (
    <h2
      className="text-gray-800 leading-8 dark:text-zinc-200 font-medium "
      {...props}
    />
  ),
  h3: (props: HeadingProps) => (
    <h3
      className="text-gray-800 leading-8 dark:text-zinc-200 font-medium "
      {...props}
    />
  ),
  h4: (props: HeadingProps) => <h4 className="font-medium" {...props} />,
  p: (props: ParagraphProps) =>  {
    return (
      <p className="text-gray-800 dark:text-zinc-300 leading-8 font-montserrat " {...props} />
    )
  },
  ol: (props: ListProps) => (
    <ol
      className="text-gray-800 dark:text-zinc-300 list-decimal pl-5 space-y-2"
      {...props}
    />
  ),
  ul: (props: ListProps) => (
    <ul
      className="text-gray-800 dark:text-zinc-300 list-disc pl-5 space-y-1"
      {...props}
    />
  ),
  li: (props: ListItemProps) => <li className="pl-1" {...props} />,
  em: (props: ComponentPropsWithoutRef<'em'>) => (
    <em className="font-medium" {...props} />
  ),
  strong: (props: ComponentPropsWithoutRef<'strong'>) => (
    <strong className="font-medium" {...props} />
  ),
  a: ({ href, children, ...props }: AnchorProps) => {
    const className =
      'text-blue-500 hover:text-blue-700 dark:text-gray-400 hover:dark:text-gray-300 dark:underline dark:underline-offset-2 dark:decoration-gray-800';
    if (href?.startsWith('/')) {
      return (
        <Link href={href} className={className} {...props}>
          {children}
        </Link>
      );
    }
    if (href?.startsWith('#')) {
      return (
        <a href={href} className={className} {...props}>
          {children}
        </a>
      );
    }
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
        {...props}
      >
        {children}
      </a>
    );
  },
  Table: ({ data }: { data: { headers: string[]; rows: string[][] } }) => (
    <table className='w-full bg-gray-100 rounded-lg'>
      <thead className='border-b border-gray-200'>
        <tr className=' items-start text-left bg-gray-200 rounded-t-lg'>
          {data.headers.map((header, index) => (
            <th key={index} className='px-4 py-2'>{header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.rows.map((row, index) => (
          <tr key={index}>
            {row.map((cell, cellIndex) => (
              <td key={cellIndex} className='px-4 py-2'>{cell}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  ),
  blockquote: (props: BlockquoteProps) => (
    <blockquote
      className="ml-[0.075em] border-l-3 border-gray-300 pl-4 text-gray-700 dark:border-zinc-600 dark:text-zinc-300"
      {...props}
    />
  ),
  MDXNewsSchema,
};

declare global {
  type MDXProvidedComponents = typeof components;
}

export function useMDXComponents(): MDXProvidedComponents {
  return components;
}
