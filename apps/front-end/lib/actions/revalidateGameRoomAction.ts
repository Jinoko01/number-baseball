'use server';

import { revalidatePath } from 'next/cache';

export async function revalidateHomeAction() {
  revalidatePath('/home');
}
