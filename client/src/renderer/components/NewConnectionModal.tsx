import React, { useState } from 'react';
import styled from 'styled-components';
import { SSHConnection } from '../../types';

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const Modal = styled.div`
  background: #1f2335;
  border-radius: 12px;
  padding: 30px;
  width: 500px;
  max-height: 80vh;
  overflow-y: auto;
`;

const Title = styled.h2`
  font-size: 20px;
  font-weight: 600;
  color: #c0caf5;
  margin: 0 0 20px 0;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const Label = styled.label`
  font-size: 13px;
  font-weight: 500;
  color: #c0caf5;
`;

const Input = styled.input`
  background: #24283b;
  border: 1px solid #3b4261;
  border-radius: 6px;
  padding: 10px 12px;
  color: #c0caf5;
  font-size: 14px;

  &:focus {
    outline: none;
    border-color: #7aa2f7;
  }
`;

const TextArea = styled.textarea`
  background: #24283b;
  border: 1px solid #3b4261;
  border-radius: 6px;
  padding: 10px 12px;
  color: #c0caf5;
  font-size: 14px;
  font-family: monospace;
  min-height: 100px;
  resize: vertical;

  &:focus {
    outline: none;
    border-color: #7aa2f7;
  }
`;

const Select = styled.select`
  background: #24283b;
  border: 1px solid #3b4261;
  border-radius: 6px;
  padding: 10px 12px;
  color: #c0caf5;
  font-size: 14px;

  &:focus {
    outline: none;
    border-color: #7aa2f7;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 10px;
`;

const Button = styled.button<{ variant?: 'primary' | 'secondary' }>`
  flex: 1;
  background: ${props => props.variant === 'secondary' ? '#3b4261' : '#7aa2f7'};
  color: ${props => props.variant === 'secondary' ? '#c0caf5' : '#1a1b26'};
  border: none;
  border-radius: 6px;
  padding: 12px 24px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${props => props.variant === 'secondary' ? '#414868' : '#89b4fa'};
  }
`;

interface Props {
  onClose: () => void;
  onSave: (connection: SSHConnection) => void;
}

const NewConnectionModal: React.FC<Props> = ({ onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    host: '',
    port: 22,
    username: '',
    authMethod: 'privateKey' as 'password' | 'privateKey',
    password: '',
    privateKey: '',
    passphrase: '',
    group: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const connection: SSHConnection = {
      id: `conn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: formData.name,
      host: formData.host,
      port: formData.port,
      username: formData.username,
      authMethod: formData.authMethod,
      password: formData.authMethod === 'password' ? formData.password : undefined,
      privateKey: formData.authMethod === 'privateKey' ? formData.privateKey : undefined,
      passphrase: formData.passphrase || undefined,
      group: formData.group || undefined,
      tags: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    onSave(connection);
  };

  return (
    <Overlay onClick={onClose}>
      <Modal onClick={e => e.stopPropagation()}>
        <Title>New SSH Connection</Title>
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label>Connection Name</Label>
            <Input
              type="text"
              placeholder="My Server"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </FormGroup>

          <FormGroup>
            <Label>Host</Label>
            <Input
              type="text"
              placeholder="192.168.1.100 or example.com"
              value={formData.host}
              onChange={e => setFormData({ ...formData, host: e.target.value })}
              required
            />
          </FormGroup>

          <FormGroup>
            <Label>Port</Label>
            <Input
              type="number"
              value={formData.port}
              onChange={e => setFormData({ ...formData, port: parseInt(e.target.value) })}
              required
            />
          </FormGroup>

          <FormGroup>
            <Label>Username</Label>
            <Input
              type="text"
              placeholder="root"
              value={formData.username}
              onChange={e => setFormData({ ...formData, username: e.target.value })}
              required
            />
          </FormGroup>

          <FormGroup>
            <Label>Authentication Method</Label>
            <Select
              value={formData.authMethod}
              onChange={e => setFormData({ ...formData, authMethod: e.target.value as any })}
            >
              <option value="privateKey">Private Key</option>
              <option value="password">Password</option>
            </Select>
          </FormGroup>

          {formData.authMethod === 'password' ? (
            <FormGroup>
              <Label>Password</Label>
              <Input
                type="password"
                placeholder="Enter password"
                value={formData.password}
                onChange={e => setFormData({ ...formData, password: e.target.value })}
                required
              />
            </FormGroup>
          ) : (
            <>
              <FormGroup>
                <Label>Private Key</Label>
                <TextArea
                  placeholder="-----BEGIN PRIVATE KEY-----&#10;...&#10;-----END PRIVATE KEY-----"
                  value={formData.privateKey}
                  onChange={e => setFormData({ ...formData, privateKey: e.target.value })}
                  required
                />
              </FormGroup>
              <FormGroup>
                <Label>Passphrase (optional)</Label>
                <Input
                  type="password"
                  placeholder="If your key is encrypted"
                  value={formData.passphrase}
                  onChange={e => setFormData({ ...formData, passphrase: e.target.value })}
                />
              </FormGroup>
            </>
          )}

          <FormGroup>
            <Label>Group (optional)</Label>
            <Input
              type="text"
              placeholder="Production, Development, etc."
              value={formData.group}
              onChange={e => setFormData({ ...formData, group: e.target.value })}
            />
          </FormGroup>

          <ButtonGroup>
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Save Connection
            </Button>
          </ButtonGroup>
        </Form>
      </Modal>
    </Overlay>
  );
};

export default NewConnectionModal;
