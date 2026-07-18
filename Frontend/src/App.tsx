import { Providers } from '@/lib/providers';
import { AppRoutes, AuthInitializer } from '@/routes/AppRoutes';

function App() {
  return (
    <Providers>
      <AuthInitializer>
        <AppRoutes />
      </AuthInitializer>
    </Providers>
  );
}

export default App;
