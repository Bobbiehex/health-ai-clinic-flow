
import React from 'react';
import Layout from '@/components/Layout';
import { TestSuite } from '@/components/testing/TestSuite';

const Testing = () => {
  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">System Testing</h1>
          <p className="text-muted-foreground">
            Run comprehensive tests to ensure system reliability
          </p>
        </div>
        <TestSuite />
      </div>
    </Layout>
  );
};

export default Testing;
