import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { AppSettings } from '../../types';

const Container = styled.div`
  display: flex;
  height: 100vh;
  background: #1a1b26;
`;

const Sidebar = styled.div`
  width: 250px;
  background: #16171e;
  border-right: 1px solid #24283b;
  padding: 20px;
`;

const BackButton = styled.button`
  width: 100%;
  background: #24283b;
  color: #c0caf5;
  border: none;
  border-radius: 6px;
  padding: 10px 16px;
  text-align: left;
  font-size: 14px;
  cursor: pointer;
  margin-bottom: 20px;

  &:hover {
    background: #2f3549;
  }
`;

const Main = styled.div`
  flex: 1;
  overflow-y: auto;
`;

const Header = styled.div`
  padding: 30px;
  border-bottom: 1px solid #24283b;
`;

const Title = styled.h1`
  font-size: 28px;
  font-weight: 600;
  color: #c0caf5;
  margin: 0;
`;

const Content = styled.div`
  padding: 30px;
  max-width: 800px;
`;

const Section = styled.div`
  margin-bottom: 40px;
`;

const SectionTitle = styled.h2`
  font-size: 18px;
  font-weight: 600;
  color: #c0caf5;
  margin: 0 0 20px 0;
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  font-size: 13px;
  font-weight: 500;
  color: #c0caf5;
  margin-bottom: 8px;
`;

const Input = styled.input`
  background: #24283b;
  border: 1px solid #3b4261;
  border-radius: 6px;
  padding: 10px 12px;
  color: #c0caf5;
  font-size: 14px;
  width: 100%;
  max-width: 400px;

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
  width: 100%;
  max-width: 400px;

  &:focus {
    outline: none;
    border-color: #7aa2f7;
  }
`;

const Checkbox = styled.input`
  width: 18px;
  height: 18px;
  cursor: pointer;
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
  color: #c0caf5;
  cursor: pointer;
`;

const Button = styled.button`
  background: #7aa2f7;
  color: #1a1b26;
  border: none;
  border-radius: 6px;
  padding: 12px 24px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #89b4fa;
  }
`;

const SuccessMessage = styled.div`
  background: rgba(158, 206, 106, 0.1);
  border: 1px solid #9ece6a;
  border-radius: 6px;
  padding: 12px 16px;
  color: #9ece6a;
  font-size: 14px;
  margin-top: 20px;
`;

const Settings: React.FC = () => {
  const navigate = useNavigate();
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    const loadedSettings = await window.terminium.settings.get();
    setSettings(loadedSettings);
  };

  const handleSave = async () => {
    if (settings) {
      await window.terminium.settings.set(settings);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
  };

  if (!settings) {
    return <Container>Loading...</Container>;
  }

  return (
    <Container>
      <Sidebar>
        <BackButton onClick={() => navigate('/')}>← Back to Connections</BackButton>
      </Sidebar>

      <Main>
        <Header>
          <Title>Settings</Title>
        </Header>

        <Content>
          <Section>
            <SectionTitle>Appearance</SectionTitle>

            <FormGroup>
              <Label>Theme</Label>
              <Select
                value={settings.theme}
                onChange={e => setSettings({ ...settings, theme: e.target.value as any })}
              >
                <option value="dark">Dark</option>
                <option value="light">Light</option>
              </Select>
            </FormGroup>

            <FormGroup>
              <Label>Font Size</Label>
              <Input
                type="number"
                min="8"
                max="24"
                value={settings.fontSize}
                onChange={e => setSettings({ ...settings, fontSize: parseInt(e.target.value) })}
              />
            </FormGroup>

            <FormGroup>
              <Label>Font Family</Label>
              <Input
                type="text"
                value={settings.fontFamily}
                onChange={e => setSettings({ ...settings, fontFamily: e.target.value })}
              />
            </FormGroup>
          </Section>

          <Section>
            <SectionTitle>Terminal</SectionTitle>

            <FormGroup>
              <Label>Cursor Style</Label>
              <Select
                value={settings.cursorStyle}
                onChange={e => setSettings({ ...settings, cursorStyle: e.target.value as any })}
              >
                <option value="block">Block</option>
                <option value="underline">Underline</option>
                <option value="bar">Bar</option>
              </Select>
            </FormGroup>

            <FormGroup>
              <CheckboxLabel>
                <Checkbox
                  type="checkbox"
                  checked={settings.cursorBlink}
                  onChange={e => setSettings({ ...settings, cursorBlink: e.target.checked })}
                />
                Cursor Blink
              </CheckboxLabel>
            </FormGroup>

            <FormGroup>
              <Label>Scrollback Lines</Label>
              <Input
                type="number"
                min="1000"
                max="50000"
                step="1000"
                value={settings.scrollback}
                onChange={e => setSettings({ ...settings, scrollback: parseInt(e.target.value) })}
              />
            </FormGroup>

            <FormGroup>
              <CheckboxLabel>
                <Checkbox
                  type="checkbox"
                  checked={settings.closeOnExit}
                  onChange={e => setSettings({ ...settings, closeOnExit: e.target.checked })}
                />
                Close terminal on exit
              </CheckboxLabel>
            </FormGroup>
          </Section>

          <Button onClick={handleSave}>Save Settings</Button>

          {saved && <SuccessMessage>Settings saved successfully!</SuccessMessage>}
        </Content>
      </Main>
    </Container>
  );
};

export default Settings;
