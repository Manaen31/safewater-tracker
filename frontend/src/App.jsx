import UsageForm from './components/UsageForm';
import UsageDashboard from './components/UsageDashboard';
import UsageChart from './components/UsageChart';

function App() {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <header className="text-center mb-8">
        <h1 className="text-3xl font-bold text-blue-700">SafeWater Tracker</h1>
        <p className="text-gray-600">Monitor and log daily water usage</p>
      </header>
      <UsageForm />
      <UsageDashboard />
      <UsageChart />
    </div>
  );
}

export default App;