import React from 'react';
import styled from 'styled-components';
import { SSHConnection } from '../../types';

const Card = styled.div`
  background: #1f2335;
  border: 1px solid #24283b;
  border-radius: 8px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border-color: #7aa2f7;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(122, 162, 247, 0.1);
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: start;
  margin-bottom: 12px;
`;

const Name = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: #c0caf5;
  margin: 0;
`;

const DeleteButton = styled.button`
  background: transparent;
  border: none;
  color: #f7768e;
  cursor: pointer;
  font-size: 18px;
  padding: 0;
  opacity: 0.6;
  transition: opacity 0.2s;

  &:hover {
    opacity: 1;
  }
`;

const Info = styled.div`
  font-size: 13px;
  color: #565f89;
  margin-bottom: 8px;
`;

const Tag = styled.span`
  display: inline-block;
  background: #24283b;
  color: #7aa2f7;
  border-radius: 4px;
  padding: 4px 8px;
  font-size: 11px;
  font-weight: 500;
  margin-right: 6px;
  margin-top: 6px;
`;

interface Props {
  connection: SSHConnection;
  onConnect: (connection: SSHConnection) => void;
  onDelete: (id: string) => void;
}

const ConnectionCard: React.FC<Props> = ({ connection, onConnect, onDelete }) => {
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onConnect(connection);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(connection.id);
  };

  return (
    <Card onClick={handleClick}>
      <Header>
        <Name>{connection.name}</Name>
        <DeleteButton onClick={handleDelete}>×</DeleteButton>
      </Header>
      <Info>
        {connection.username}@{connection.host}:{connection.port}
      </Info>
      <div>
        <Tag>{connection.authMethod === 'password' ? '🔑 Password' : '🔐 Key'}</Tag>
        {connection.group && <Tag>📁 {connection.group}</Tag>}
      </div>
    </Card>
  );
};

export default ConnectionCard;
