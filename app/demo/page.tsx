'use client';

import { useState } from 'react';

import Image from 'next/image';

import type { LinkitItemSize } from '@/types/linkit-item';

import { LinkitItem } from '@/components/linkit-item';
import { Button } from '@/components/ui/button';

export default function DemoPage() {
  const [size1, setSize1] = useState<LinkitItemSize>('md');
  const [size2, setSize2] = useState<LinkitItemSize>('sm');
  const [size3, setSize3] = useState<LinkitItemSize>('lg');

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-12">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">LinkitItem Component Demo</h1>
        <p className="text-gray-600 mb-12">
          Hover over items to see controls. Click resize buttons to change size.
        </p>

        <div className="flex flex-wrap gap-8 items-start">
          {/* Example 1: Instagram-style profile */}
          <LinkitItem
            size={size1}
            onSizeChange={setSize1}
            onDelete={() => alert('Delete item 1')}
          >
            <div className="flex flex-col items-center gap-4 h-full justify-center">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 rounded-2xl flex items-center justify-center">
                <span className="text-white text-2xl font-bold">IG</span>
              </div>
              <h3 className="text-xl font-semibold">@vbrdnk</h3>
              <Button className="bg-blue-500 hover:bg-blue-600">Follow 2.1K</Button>
            </div>
          </LinkitItem>

          {/* Example 2: Simple text link */}
          <LinkitItem
            size={size2}
            onSizeChange={setSize2}
            onDelete={() => alert('Delete item 2')}
          >
            <div className="flex items-center gap-4 h-full">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                <span className="text-white text-xl font-bold">🔗</span>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg">My Portfolio</h3>
                <p className="text-gray-500 text-sm">Check out my work</p>
              </div>
            </div>
          </LinkitItem>

          {/* Example 3: Image gallery */}
          <LinkitItem
            size={size3}
            onSizeChange={setSize3}
            onDelete={() => alert('Delete item 3')}
          >
            <div className="flex flex-col gap-4 h-full">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl" />
                <h3 className="font-semibold">My Gallery</h3>
              </div>
              <div className="grid grid-cols-2 gap-2 flex-1">
                <div className="bg-gray-200 rounded-lg aspect-square" />
                <div className="bg-gray-300 rounded-lg aspect-square" />
                <div className="bg-gray-300 rounded-lg aspect-square" />
                <div className="bg-gray-200 rounded-lg aspect-square" />
              </div>
            </div>
          </LinkitItem>

          {/* Example 4: Video embed placeholder */}
          <LinkitItem size="xl" onDelete={() => alert('Delete item 4')}>
            <div className="flex flex-col gap-4 h-full">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-500 rounded-xl flex items-center justify-center">
                  <span className="text-white text-xl">▶</span>
                </div>
                <div>
                  <h3 className="font-semibold">Latest Video</h3>
                  <p className="text-gray-500 text-sm">3.2M views</p>
                </div>
              </div>
              <div className="flex-1 bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl flex items-center justify-center">
                <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <span className="text-white text-3xl ml-1">▶</span>
                </div>
              </div>
            </div>
          </LinkitItem>

          {/* Example 5: Contact card */}
          <LinkitItem size="xs" onDelete={() => alert('Delete item 5')}>
            <div className="flex flex-col items-center gap-3 h-full justify-center">
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full" />
              <h3 className="font-semibold">Contact Me</h3>
              <Button variant="outline" size="sm">
                Send Message
              </Button>
            </div>
          </LinkitItem>
        </div>

        <div className="mt-16 p-6 bg-white rounded-xl shadow-sm border border-gray-200">
          <h2 className="text-xl font-semibold mb-4">Component Features</h2>
          <ul className="space-y-2 text-gray-600">
            <li>✅ 5 size variants (xs, sm, md, lg, xl) with smooth transitions</li>
            <li>✅ Hover-triggered controls (delete & resize)</li>
            <li>✅ Content-agnostic (accepts any children)</li>
            <li>✅ Controlled and uncontrolled size state</li>
            <li>✅ Keyboard accessible</li>
            <li>✅ Disabled state support</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
