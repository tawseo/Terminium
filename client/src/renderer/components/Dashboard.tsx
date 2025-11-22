import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { SSHConnection } from '../../types';
import ConnectionCard from './ConnectionCard';
import NewConnectionModal from './NewConnectionModal';

const Container = styled.div`
  display: flex;
  height: 100vh;
  background: #1a1b26;
`;

const Sidebar = styled.div`
  width: 250px;
  background: #16171e;
  border-right: 1px solid #24283b;
  display: flex;
  flex-direction: column;
`;

const SidebarHeader = styled.div`
  padding: 20px;
  border-bottom: 1px solid #24283b;
`;

const Logo = styled.h1`
  font-size: 20px;
  font-weight: 700;
  color: #7aa2f7;
  margin: 0;
`;

const SidebarMenu = styled.div`
  flex: 1;
  padding: 10px;
`;

const MenuItem = styled.button<{ active?: boolean }>`
  width: 100%;
  background: ${props => props.active ? '#24283b' : 'transparent'};
  color: ${props => props.active ? '#7aa2f7' : '#c0caf5'};
  border: none;
  border-radius: 6px;
  padding: 12px 16px;
  text-align: left;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
  margin-bottom: 4px;

  &:hover {
    background: #24283b;
  }
`;

const Main = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const Header = styled.div`
  padding: 20px 30px;
  border-bottom: 1px solid #24283b;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Title = styled.h2`
  font-size: 24px;
  font-weight: 600;
  color: #c0caf5;
  margin: 0;
`;

const Button = styled.button`
  background: #7aa2f7;
  color: #1a1b26;
  border: none;
  border-radius: 6px;
  padding: 10px 20px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #89b4fa;
    transform: translateY(-1px);
  }
`;

const Content = styled.div`
  flex: 1;
  padding: 30px;
  overflow-y: auto;
`;

const ConnectionGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #565f89;
  text-align: center;
`;

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [connections, setConnections] = useState<SSHConnection[]>([]);
  const [showNewConnection, setShowNewConnection] = useState(false);
  const [activeView, setActiveView] = useState('connections');

  useEffect(() => {
    loadConnections();
  }, []);

  const loadConnections = async () => {
    const result = await window.terminium.connection.list();
    setConnections(result);
  };

  const handleConnect = async (connection: SSHConnection) => {
    const result = await window.terminium.ssh.connect(connection);
    if (result.success) {
      navigate(`/terminal/${result.sessionId}`);
    } else {
      alert(`Connection failed: ${result.error}`);
    }
  };

  const handleDeleteConnection = async (id: string) => {
    if (confirm('Are you sure you want to delete this connection?')) {
      await window.terminium.connection.delete(id);
      loadConnections();
    }
  };

  const handleSaveConnection = async (connection: SSHConnection) => {
    await window.terminium.connection.save(connection);
    setShowNewConnection(false);
    loadConnections();
  };

  return (
    <Container>
      <Sidebar>
        <SidebarHeader>
          <Logo>Terminium</Logo>
        </SidebarHeader>
        <SidebarMenu>
          <MenuItem active={activeView === 'connections'} onClick={() => setActiveView('connections')}>
            🖥️ Connections
          </MenuItem>
          <MenuItem active={activeView === 'settings'} onClick={() => navigate('/settings')}>
            ⚙️ Settings
          </MenuItem>
        </SidebarMenu>
      </Sidebar>

      <Main>
        <Header>
          <Title>SSH Connections</Title>
          <Button onClick={() => setShowNewConnection(true)}>
            + New Connection
          </Button>
        </Header>

        <Content>
          {connections.length === 0 ? (
            <EmptyState>
              <h3>No connections yet</h3>
              <p>Click "New Connection" to add your first SSH server</p>
            </EmptyState>
          ) : (
            <ConnectionGrid>
              {connections.map(connection => (
                <ConnectionCard
                  key={connection.id}
                  connection={connection}
                  onConnect={handleConnect}
                  onDelete={handleDeleteConnection}
                />
              ))}
            </ConnectionGrid>
          )}
        </Content>
      </Main>

      {showNewConnection && (
        <NewConnectionModal
          onClose={() => setShowNewConnection(false)}
          onSave={handleSaveConnection}
        />
      )}
    </Container>
  );
};

export default Dashboard;
