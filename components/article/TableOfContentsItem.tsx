import { Text } from '@mantine/core';

interface TableOfContentsItemProps {
  text: string;
  href: string;
}

export function TableOfContentsItem({ text, href }: TableOfContentsItemProps) {
  return (
    <Text 
      component="a" 
      href={href}
      size="sm" 
      className="text-gray-600 hover:text-blue-500 block py-1 cursor-pointer"
    >
      {text}
    </Text>
  );
}
