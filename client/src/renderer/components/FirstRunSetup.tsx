import React, { useState } from 'react';
import styled from 'styled-components';
import { ICMSFData, ServerConfig, UserCredentials } from '../../types';

const SetupContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background: linear-gradient(135deg, #1a1b26 0%, #24283b 100%);
`;

const SetupCard = styled.div`
  background: #1f2335;
  border-radius: 12px;
  padding: 40px;
  width: 500px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
`;

const Title = styled.h1`
  font-size: 28px;
  font-weight: 600;
  margin-bottom: 10px;
  color: #7aa2f7;
`;

const Subtitle = styled.p`
  font-size: 14px;
  color: #565f89;
  margin-bottom: 30px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
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
  transition: all 0.2s;

  &:focus {
    outline: none;
    border-color: #7aa2f7;
    box-shadow: 0 0 0 3px rgba(122, 162, 247, 0.1);
  }

  &::placeholder {
    color: #565f89;
  }
`;

const Button = styled.button<{ variant?: 'primary' | 'secondary' }>`
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
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 10px;
`;

const ToggleButton = styled.button<{ active: boolean }>`
  flex: 1;
  background: ${props => props.active ? '#7aa2f7' : '#24283b'};
  color: ${props => props.active ? '#1a1b26' : '#c0caf5'};
  border: 1px solid ${props => props.active ? '#7aa2f7' : '#3b4261'};
  border-radius: 6px;
  padding: 10px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border-color: #7aa2f7;
  }
`;

const ErrorMessage = styled.div`
  background: rgba(247, 118, 142, 0.1);
  border: 1px solid #f7768e;
  border-radius: 6px;
  padding: 12px;
  color: #f7768e;
  font-size: 13px;
`;

const SuccessMessage = styled.div`
  background: rgba(158, 206, 106, 0.1);
  border: 1px solid #9ece6a;
  border-radius: 6px;
  padding: 12px;
  color: #9ece6a;
  font-size: 13px;
`;

interface Props {
  onComplete: () => void;
}

type SetupMode = 'choose' | 'new' | 'import';

const FirstRunSetup: React.FC<Props> = ({ onComplete }) => {
  const [mode, setMode] = useState<SetupMode>('choose');
  const [step, setStep] = useState(1);
  const [credentials, setCredentials] = useState<UserCredentials>({ username: '', password: '' });
  const [serverConfig, setServerConfig] = useState<ServerConfig>({ ip: '', sshPort: 22, apiPort: 3000 });
  const [importPassword, setImportPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChooseMode = (selectedMode: 'new' | 'import') => {
    setMode(selectedMode);
    setStep(1);
    setError('');
  };

  const handleNewServerSetup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (step === 1) {
      // Validate credentials
      if (!credentials.username || !credentials.password) {
        setError('Please enter both username and password');
        return;
      }
      if (credentials.password.length < 12) {
        setError('Password must be at least 12 characters for strong encryption');
        return;
      }
      setStep(2);
    } else if (step === 2) {
      // Validate server config
      if (!serverConfig.ip) {
        setError('Please enter server IP address');
        return;
      }

      // Complete setup
      setSuccess('Connecting to server...');

      // Simulate setup process
      setTimeout(async () => {
        await window.terminium.app.completeSetup();
        onComplete();
      }, 1500);
    }
  };

  const handleImportICMSF = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!importPassword) {
      setError('Please enter the file password');
      return;
    }

    try {
      const result = await window.terminium.icmsf.import(importPassword);
      if (result.success) {
        setSuccess('Connection file imported successfully!');
        setTimeout(async () => {
          await window.terminium.app.completeSetup();
          onComplete();
        }, 1500);
      } else {
        setError(result.error || 'Failed to import connection file');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to import connection file');
    }
  };

  const renderChooseMode = () => (
    <>
      <Title>Welcome to Terminium</Title>
      <Subtitle>Choose how you'd like to get started</Subtitle>
      <ButtonGroup>
        <Button variant="primary" onClick={() => handleChooseMode('new')}>
          New Server Connection
        </Button>
        <Button variant="secondary" onClick={() => handleChooseMode('import')}>
          Import Connection
        </Button>
      </ButtonGroup>
    </>
  );

  const renderNewServerSetup = () => (
    <>
      <Title>Server Setup</Title>
      <Subtitle>Step {step} of 2</Subtitle>

      {error && <ErrorMessage>{error}</ErrorMessage>}
      {success && <SuccessMessage>{success}</SuccessMessage>}

      <Form onSubmit={handleNewServerSetup}>
        {step === 1 && (
          <>
            <FormGroup>
              <Label>Username</Label>
              <Input
                type="text"
                placeholder="Enter username"
                value={credentials.username}
                onChange={e => setCredentials({ ...credentials, username: e.target.value })}
                autoFocus
              />
            </FormGroup>
            <FormGroup>
              <Label>Password</Label>
              <Input
                type="password"
                placeholder="Enter password (min 12 characters)"
                value={credentials.password}
                onChange={e => setCredentials({ ...credentials, password: e.target.value })}
              />
            </FormGroup>
          </>
        )}

        {step === 2 && (
          <>
            <FormGroup>
              <Label>Server IP Address</Label>
              <Input
                type="text"
                placeholder="192.168.1.100 or example.com"
                value={serverConfig.ip}
                onChange={e => setServerConfig({ ...serverConfig, ip: e.target.value })}
                autoFocus
              />
            </FormGroup>
            <FormGroup>
              <Label>SSH Port</Label>
              <Input
                type="number"
                placeholder="22"
                value={serverConfig.sshPort}
                onChange={e => setServerConfig({ ...serverConfig, sshPort: parseInt(e.target.value) })}
              />
            </FormGroup>
            <FormGroup>
              <Label>API Port</Label>
              <Input
                type="number"
                placeholder="3000"
                value={serverConfig.apiPort}
                onChange={e => setServerConfig({ ...serverConfig, apiPort: parseInt(e.target.value) })}
              />
            </FormGroup>
          </>
        )}

        <ButtonGroup>
          {step > 1 && (
            <Button type="button" variant="secondary" onClick={() => setStep(step - 1)}>
              Back
            </Button>
          )}
          <Button type="submit" variant="primary">
            {step === 2 ? 'Complete Setup' : 'Next'}
          </Button>
        </ButtonGroup>
      </Form>

      {step === 1 && (
        <Button
          type="button"
          variant="secondary"
          onClick={() => setMode('choose')}
          style={{ marginTop: '20px', width: '100%' }}
        >
          Back to Options
        </Button>
      )}
    </>
  );

  const renderImportSetup = () => (
    <>
      <Title>Import Connection</Title>
      <Subtitle>Import an existing Terminium connection file (.icmsf)</Subtitle>

      {error && <ErrorMessage>{error}</ErrorMessage>}
      {success && <SuccessMessage>{success}</SuccessMessage>}

      <Form onSubmit={handleImportICMSF}>
        <FormGroup>
          <Label>Connection File Password</Label>
          <Input
            type="password"
            placeholder="Enter the password for your .icmsf file"
            value={importPassword}
            onChange={e => setImportPassword(e.target.value)}
            autoFocus
          />
        </FormGroup>

        <ButtonGroup>
          <Button type="button" variant="secondary" onClick={() => setMode('choose')}>
            Back
          </Button>
          <Button type="submit" variant="primary">
            Import File
          </Button>
        </ButtonGroup>
      </Form>
    </>
  );

  return (
    <SetupContainer>
      <SetupCard>
        {mode === 'choose' && renderChooseMode()}
        {mode === 'new' && renderNewServerSetup()}
        {mode === 'import' && renderImportSetup()}
      </SetupCard>
    </SetupContainer>
  );
};

export default FirstRunSetup;
