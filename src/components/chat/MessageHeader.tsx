
import React from 'react';

interface MessageHeaderProps {
  senderFirstName: string;
  senderLastName: string;
}

export const MessageHeader: React.FC<MessageHeaderProps> = ({ 
  senderFirstName, 
  senderLastName 
}) => {
  return (
    <p className="text-xs text-gray-500 mb-1 px-3">
      {senderFirstName} {senderLastName}
    </p>
  );
};
