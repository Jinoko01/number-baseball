import { revalidatePath } from 'next/cache';

export async function revalidateHomeAction() {
  'use server';
  revalidatePath('/home');
}
