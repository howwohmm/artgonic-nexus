import React, { useState } from 'react';
import { Plus, Search, MessageSquare, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface Transaction {
  id: number;
  amount: number;
  description: string;
  category: string;
  date: string;
  user: string;
  tags: string[];
  notes?: string;
}

export const FinanceTracker = () => {
  const [activeTab, setActiveTab] = useState('Transactions');
  const [transactions] = useState<Transaction[]>([
    {
      id: 1,
      amount: 350.00,
      description: "domain",
      category: "other",
      date: "Jul 2, 2025",
      user: "Ohm",
      tags: ["artgonic"],
      notes: "Ohm paid"
    }
  ]);

  const tabs = ['Transactions', 'Subscriptions', 'Summary'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-1 text-sm text-muted-foreground">
          <span>Ohm</span>
          <span>•</span>
          <span>...</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-8 border-b border-border">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-3 text-sm font-medium transition-colors border-b-2 ${
              activeTab === tab
                ? 'border-foreground text-foreground'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Transactions Content */}
      {activeTab === 'Transactions' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-2">Transactions</h2>
              <p className="text-muted-foreground">Track your expenses and income</p>
            </div>
            <Button className="bg-foreground text-background hover:bg-foreground/90">
              <Plus size={16} className="mr-2" />
              Add Transaction
            </Button>
          </div>

          {/* Search */}
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search transactions..."
              className="pl-10 bg-background border-border"
            />
          </div>

          {/* Transaction List */}
          <div className="space-y-4">
            {transactions.map((transaction) => (
              <div key={transaction.id} className="bg-card border border-border rounded-lg p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4 mb-4">
                      <span className="text-lg font-semibold text-foreground">
                        $ {transaction.amount.toFixed(2)}
                      </span>
                      <span className="text-foreground">{transaction.description}</span>
                    </div>
                    
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-4">
                      <div className="flex items-center space-x-1">
                        <span>👤</span>
                        <span>{transaction.user}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <span>🏷️</span>
                        <span className="bg-muted px-2 py-1 rounded text-xs">
                          {transaction.category}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <span>📅</span>
                        <span>{transaction.date}</span>
                      </div>
                    </div>

                    <div className="mb-4">
                      <div className="text-sm text-muted-foreground mb-2">Tags:</div>
                      <div className="flex space-x-2">
                        {transaction.tags.map((tag, index) => (
                          <span key={index} className="bg-muted text-muted-foreground px-2 py-1 rounded text-xs">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    {transaction.notes && (
                      <div>
                        <div className="text-sm text-muted-foreground mb-2">Notes:</div>
                        <p className="text-sm text-foreground">{transaction.notes}</p>
                      </div>
                    )}
                  </div>

                  <div className="flex space-x-2">
                    <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                      <MessageSquare size={16} />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive">
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Other tabs placeholder */}
      {activeTab !== 'Transactions' && (
        <div className="text-center py-16">
          <h2 className="text-2xl font-semibold mb-4 text-foreground">
            {activeTab}
          </h2>
          <p className="text-muted-foreground">
            Coming soon!
          </p>
        </div>
      )}
    </div>
  );
};
