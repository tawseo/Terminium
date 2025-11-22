import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Terminal as XTerm } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import { WebLinksAddon } from 'xterm-addon-web-links';
import 'xterm/css/xterm.css';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: #1a1b26;
`;

const Header = styled.div`
  background: #16171e;
  border-bottom: 1px solid #24283b;
  padding: 12px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const BackButton = styled.button`
  background: transparent;
  border: none;
  color: #7aa2f7;
  font-size: 20px;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
  transition: background 0.2s;

  &:hover {
    background: #24283b;
  }
`;

const SessionInfo = styled.div`
  font-size: 14px;
  color: #c0caf5;
  font-weight: 500;
`;

const Status = styled.div<{ connected: boolean }>`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: ${props => props.connected ? '#9ece6a' : '#f7768e'};
`;

const StatusDot = styled.div<{ connected: boolean }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${props => props.connected ? '#9ece6a' : '#f7768e'};
`;

const TerminalContainer = styled.div`
  flex: 1;
  padding: 10px;
  overflow: hidden;
`;

const Terminal: React.FC = () => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  const terminalRef = useRef<HTMLDivElement>(null);
  const xtermRef = useRef<XTerm | null>(null);
  const fitAddonRef = useRef<FitAddon | null>(null);
  const [connected, setConnected] = useState(true);

  useEffect(() => {
    if (!terminalRef.current || !sessionId) return;

    // Load settings
    const initTerminal = async () => {
      const settings = await window.terminium.settings.get();

      // Create terminal
      const term = new XTerm({
        theme: {
          background: '#1a1b26',
          foreground: '#c0caf5',
          cursor: '#c0caf5',
          black: '#15161e',
          red: '#f7768e',
          green: '#9ece6a',
          yellow: '#e0af68',
          blue: '#7aa2f7',
          magenta: '#bb9af7',
          cyan: '#7dcfff',
          white: '#a9b1d6',
          brightBlack: '#414868',
          brightRed: '#f7768e',
          brightGreen: '#9ece6a',
          brightYellow: '#e0af68',
          brightBlue: '#7aa2f7',
          brightMagenta: '#bb9af7',
          brightCyan: '#7dcfff',
          brightWhite: '#c0caf5',
        },
        fontSize: settings.fontSize,
        fontFamily: settings.fontFamily,
        cursorStyle: settings.cursorStyle,
        cursorBlink: settings.cursorBlink,
        scrollback: settings.scrollback,
        allowProposedApi: true,
      });

      // Add addons
      const fitAddon = new FitAddon();
      const webLinksAddon = new WebLinksAddon();

      term.loadAddon(fitAddon);
      term.loadAddon(webLinksAddon);

      term.open(terminalRef.current);
      fitAddon.fit();

      xtermRef.current = term;
      fitAddonRef.current = fitAddon;

      // Handle terminal input
      term.onData(data => {
        window.terminium.ssh.write(sessionId, data);
      });

      // Handle terminal resize
      term.onResize(({ cols, rows }) => {
        window.terminium.ssh.resize(sessionId, cols, rows);
      });

      // Listen for SSH data
      window.terminium.ssh.onData((data: any) => {
        if (data.sessionId === sessionId) {
          term.write(data.data);
        }
      });

      // Resize on window resize
      const handleResize = () => {
        fitAddon.fit();
      };
      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
        window.terminium.ssh.removeDataListener();
        term.dispose();
      };
    };

    initTerminal();
  }, [sessionId]);

  const handleDisconnect = async () => {
    if (sessionId) {
      await window.terminium.ssh.disconnect(sessionId);
    }
    navigate('/');
  };

  return (
    <Container>
      <Header>
        <HeaderLeft>
          <BackButton onClick={handleDisconnect}>←</BackButton>
          <SessionInfo>Session: {sessionId?.substring(0, 16)}...</SessionInfo>
        </HeaderLeft>
        <Status connected={connected}>
          <StatusDot connected={connected} />
          {connected ? 'Connected' : 'Disconnected'}
        </Status>
      </Header>
      <TerminalContainer ref={terminalRef} />
    </Container>
  );
};

export default Terminal;
