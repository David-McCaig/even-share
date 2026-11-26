import { beforeEach, expect, test, vi } from 'vitest';
import { useEffect, useState } from 'react';
import { auth } from '../../../firebase/firebaseconfig';
import { useSignedinDispatchUserInfo } from './useSignedinDispatchUserInfo';
import { login, logout } from '../userSlice';

const { dispatch } = vi.hoisted(() => ({ dispatch: vi.fn() }));
vi.mock('react', () => ({ useEffect: vi.fn(), useState: vi.fn() }));
vi.mock('../../../hooks/reduxTypeScriptHooks', () => ({ useAppDispatch: () => dispatch }));
vi.mock('../../../firebase/firebaseconfig', () => ({ auth: { onAuthStateChanged: vi.fn() } }));

beforeEach(() => vi.clearAllMocks());

function ObserverHarness() {
  const setInitializing = vi.fn();
  const unsubscribe = vi.fn();
  vi.mocked(useState).mockReturnValue([true, setInitializing]);
  vi.mocked(auth.onAuthStateChanged).mockReturnValue(unsubscribe);
  expect(useSignedinDispatchUserInfo()).toBe(true);
  expect(dispatch).not.toHaveBeenCalled();
  const cleanup = vi.mocked(useEffect).mock.calls[0][0]()!;
  const notify = vi.mocked(auth.onAuthStateChanged).mock.calls[0][0] as (user: unknown) => void;
  return { notify, cleanup, unsubscribe, setInitializing };
}

test('restores the saved user before releasing the initialization gate and unsubscribes', () => {
  const observer = ObserverHarness();
  observer.notify({ email: 'steve@example.com', displayName: 'Steve', photoURL: null, uid: 'steve' });
  expect(dispatch).toHaveBeenCalledWith(login({ email: 'steve@example.com', displayName: 'Steve', photoUrl: null, userId: 'steve' }));
  expect(observer.setInitializing).toHaveBeenCalledWith(false);
  expect(dispatch.mock.invocationCallOrder[0]).toBeLessThan(observer.setInitializing.mock.invocationCallOrder[0]);
  observer.cleanup();
  expect(observer.unsubscribe).toHaveBeenCalledOnce();
});

test('releases the gate for signed-out visitors and clears stale user state', () => {
  const observer = ObserverHarness();
  observer.notify(null);
  expect(dispatch).toHaveBeenCalledWith(logout());
  expect(observer.setInitializing).toHaveBeenCalledWith(false);
});
