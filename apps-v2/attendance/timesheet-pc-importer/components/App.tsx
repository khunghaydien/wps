import React from 'react';

const App: React.FC<{
  GlobalContainer: React.ComponentType<{ children: React.ReactNode }>;
  HeaderContainer: React.ComponentType;
  ContentContainer: React.ComponentType;
  ProxyEmployeeSelectDialogContainer: React.ComponentType;
  NotificationContainer: React.ComponentType;
}> = ({
  GlobalContainer,
  HeaderContainer,
  ContentContainer,
  ProxyEmployeeSelectDialogContainer,
  NotificationContainer,
}) => {
  return (
    <GlobalContainer>
      <ProxyEmployeeSelectDialogContainer />
      <HeaderContainer />
      <ContentContainer />
      <NotificationContainer />
    </GlobalContainer>
  );
};

export default App;
