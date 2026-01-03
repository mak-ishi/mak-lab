'use client';

import { useState, useEffect } from 'react';

interface Todo {
  id: number;
  text: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  dueDate?: string; // Optional deadline
}

type FilterType = 'all' | 'active' | 'completed';

export default function TodoApp() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [inputText, setInputText] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [dueDate, setDueDate] = useState('');
  const [filter, setFilter] = useState<FilterType>('all');
  const [mounted, setMounted] = useState(false);

  // Load todos from localStorage on mount
  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem('todos-next');
    if (saved) {
      try {
        setTodos(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse todos:', e);
      }
    }
  }, []);

  // Save todos to localStorage whenever they change
  useEffect(() => {
    if (mounted) {
      localStorage.setItem('todos-next', JSON.stringify(todos));
    }
  }, [todos, mounted]);

  const addTodo = () => {
    if (!inputText.trim()) return;

    const newTodo: Todo = {
      id: Date.now(),
      text: inputText.trim(),
      completed: false,
      priority,
      createdAt: new Date().toISOString(),
      ...(dueDate && { dueDate }),
    };

    setTodos([...todos, newTodo]);
    setInputText('');
    setDueDate('');
  };

  const toggleTodo = (id: number) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = (id: number) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const clearCompleted = () => {
    setTodos(todos.filter(todo => !todo.completed));
  };

  const getFilteredTodos = () => {
    switch (filter) {
      case 'active':
        return todos.filter(todo => !todo.completed);
      case 'completed':
        return todos.filter(todo => todo.completed);
      default:
        return todos;
    }
  };

  // Get deadline status
  const getDeadlineStatus = (dueDate?: string) => {
    if (!dueDate) return null;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(dueDate);
    due.setHours(0, 0, 0, 0);

    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return 'overdue';
    if (diffDays === 0) return 'today';
    if (diffDays <= 3) return 'soon';
    return 'future';
  };

  // Format due date for display
  const formatDueDate = (dueDate?: string) => {
    if (!dueDate) return null;

    const date = new Date(dueDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(dueDate);
    due.setHours(0, 0, 0, 0);

    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    const formatted = `${date.getMonth() + 1}/${date.getDate()}`;

    if (diffDays < 0) return `${formatted} (${Math.abs(diffDays)}日超過)`;
    if (diffDays === 0) return `${formatted} (今日)`;
    if (diffDays === 1) return `${formatted} (明日)`;
    if (diffDays <= 3) return `${formatted} (${diffDays}日後)`;
    return formatted;
  };

  const activeCount = todos.filter(todo => !todo.completed).length;
  const filteredTodos = getFilteredTodos();

  const priorityColors = {
    high: 'border-red-500 bg-red-50',
    medium: 'border-orange-500 bg-orange-50',
    low: 'border-green-500 bg-green-50',
  };

  const priorityBadgeColors = {
    high: 'bg-red-100 text-red-700',
    medium: 'bg-orange-100 text-orange-700',
    low: 'bg-green-100 text-green-700',
  };

  const priorityLabels = {
    high: '高',
    medium: '中',
    low: '低',
  };

  const deadlineStatusColors = {
    overdue: 'bg-red-600 text-white',
    today: 'bg-yellow-500 text-white',
    soon: 'bg-blue-500 text-white',
    future: 'bg-gray-500 text-white',
  };

  if (!mounted) {
    return null; // Avoid hydration mismatch
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 to-purple-800 py-8 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-2xl p-8">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 text-center mb-2">
            Todo App
          </h1>
          <p className="text-gray-600 text-center">Next.js + TypeScript + Tailwind</p>
        </header>

        {/* Input Section */}
        <div className="mb-6 space-y-3">
          <div className="flex gap-3">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addTodo()}
              placeholder="新しいタスクを入力..."
              className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-purple-500 transition-colors"
            />
            <button
              onClick={addTodo}
              className="px-6 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors"
            >
              追加
            </button>
          </div>
          <div className="flex gap-3">
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as 'low' | 'medium' | 'high')}
              className="px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-purple-500 transition-colors"
            >
              <option value="low">優先度: 低</option>
              <option value="medium">優先度: 中</option>
              <option value="high">優先度: 高</option>
            </select>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="flex-1 px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-purple-500 transition-colors"
              placeholder="期限（オプション）"
            />
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="flex gap-2 mb-6 justify-center">
          {(['all', 'active', 'completed'] as FilterType[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === f
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {f === 'all' ? 'すべて' : f === 'active' ? '未完了' : '完了'}
            </button>
          ))}
        </div>

        {/* Todo List */}
        <div className="space-y-3 mb-6">
          {filteredTodos.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              タスクがありません
            </div>
          ) : (
            filteredTodos.map((todo) => {
              const deadlineStatus = getDeadlineStatus(todo.dueDate);

              return (
                <div
                  key={todo.id}
                  className={`flex items-center gap-3 p-4 rounded-lg border-l-4 transition-all ${
                    priorityColors[todo.priority]
                  } ${todo.completed ? 'opacity-60' : ''}`}
                >
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => toggleTodo(todo.id)}
                    className="w-5 h-5 rounded cursor-pointer"
                  />
                  <div className="flex-1">
                    <span
                      className={`text-gray-800 ${
                        todo.completed ? 'line-through' : ''
                      }`}
                    >
                      {todo.text}
                    </span>
                    {todo.dueDate && (
                      <div className="flex items-center gap-2 mt-1">
                        <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className={`text-xs font-medium ${
                          deadlineStatus === 'overdue' ? 'text-red-600' :
                          deadlineStatus === 'today' ? 'text-yellow-600' :
                          deadlineStatus === 'soon' ? 'text-blue-600' :
                          'text-gray-600'
                        }`}>
                          {formatDueDate(todo.dueDate)}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-1 rounded text-xs font-semibold ${
                        priorityBadgeColors[todo.priority]
                      }`}
                    >
                      {priorityLabels[todo.priority]}
                    </span>
                    {deadlineStatus && deadlineStatus !== 'future' && (
                      <span
                        className={`px-2 py-1 rounded text-xs font-semibold ${
                          deadlineStatusColors[deadlineStatus]
                        }`}
                      >
                        {deadlineStatus === 'overdue' ? '期限超過' :
                         deadlineStatus === 'today' ? '今日' :
                         deadlineStatus === 'soon' ? '近日' : ''}
                      </span>
                    )}
                    <button
                      onClick={() => deleteTodo(todo.id)}
                      className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors text-sm font-medium"
                    >
                      削除
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Stats */}
        <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
          <span className="text-gray-600">
            {activeCount}個のタスク
          </span>
          <button
            onClick={clearCompleted}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors text-sm font-medium"
          >
            完了済みを削除
          </button>
        </div>
      </div>
    </div>
  );
}
