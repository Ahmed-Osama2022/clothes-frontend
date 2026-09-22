<script setup>
import { computed, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import { useToastStore } from '../stores/toast';

// ======= REGISTER PAGE (route: /register) =======
// Realtime validation (errors as you type) + toasts for success/error.
// Register calls src/api/auth.js (axios client prepared for Laravel + Sanctum).
const router = useRouter();
const auth = useAuthStore();
const toast = useToastStore();

const fullName = ref('');
const email = ref('');
const password = ref('');
const confirm = ref('');
const terms = ref(false);
const showPassword = ref(false);
const showConfirm = ref(false);
const submitting = ref(false);
const touched = reactive({
  fullName: false,
  email: false,
  password: false,
  confirm: false,
  terms: false,
});

const isEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

const nameError = computed(() => {
  if (!fullName.value) return 'Full name is required';
  return fullName.value.trim().length < 2 ? 'Name must be at least 2 characters' : '';
});
const emailError = computed(() => {
  if (!email.value) return 'Email is required';
  return isEmail(email.value) ? '' : 'Enter a valid email address';
});
const passwordError = computed(() => {
  if (!password.value) return 'Password is required';
  if (password.value.length < 8) return 'Password must be at least 8 characters';
  if (!/[a-zA-Z]/.test(password.value) || !/\d/.test(password.value)) return 'Use at least one letter and one number';
  return '';
});
const confirmError = computed(() => {
  if (!confirm.value) return 'Confirm your password';
  return confirm.value === password.value ? '' : 'Passwords do not match';
});
const termsError = computed(() => (terms.value ? '' : 'You must accept the terms'));

const hasErrors = computed(() =>
  Boolean(nameError.value || emailError.value || passwordError.value || confirmError.value || termsError.value)
);

const showError = (field, errorText) => touched[field] && errorText;

const handleSubmit = async () => {
  touched.fullName = true;
  touched.email = true;
  touched.password = true;
  touched.confirm = true;
  touched.terms = true;
  if (hasErrors.value) {
    toast.error('Please fix the highlighted fields');
    return;
  }

  submitting.value = true;
  try {
    // Backend not running yet — resolves once the Laravel API responds.
    await auth.register({
      name: fullName.value.trim(),
      email: email.value,
      password: password.value,
    });
    toast.success('Account created. Welcome aboard!');
    router.push('/login');
  } catch (error) {
    toast.error(error.message || 'Registration failed');
  } finally {
    submitting.value = false;
  }
};
</script>

<template>
  <!-- ======= REGISTRATION FORM ======= -->
  <main class="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-snow-100 px-4 py-12">
    <div class="w-full max-w-md" data-aos="fade-up">
      <div class="rounded-2xl bg-white p-8 shadow-sm">
        <div class="flex items-center gap-3">
          <span class="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-100 text-primary-600">
            <i class="pi pi-user-plus" aria-hidden="true"></i>
          </span>
          <div>
            <h1 class="text-2xl font-bold text-ink-900">Create account</h1>
            <p class="text-sm text-ink-500">Join Clothes Shop</p>
          </div>
        </div>

        <form class="mt-8 space-y-5" novalidate @submit.prevent="handleSubmit">
          <!-- ======= FULL NAME ======= -->
          <div>
            <label for="reg-name" class="mb-1.5 block text-sm font-medium text-ink-700">Full name</label>
            <div class="relative">
              <i class="pi pi-user absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-ink-400" aria-hidden="true"></i>
              <input
                id="reg-name"
                v-model="fullName"
                type="text"
                autocomplete="name"
                placeholder="Jane Doe"
                class="w-full rounded-lg border bg-white py-2.5 pl-10 pr-4 text-sm text-ink-900 outline-none transition focus:border-primary-400"
                :class="showError('fullName', nameError) ? 'border-rose-400 focus:border-rose-400' : 'border-ink-200'"
                @blur="touched.fullName = true"
              />
            </div>
            <p v-if="showError('fullName', nameError)" class="mt-1.5 flex items-center gap-1 text-sm text-rose-600">
              <i class="pi pi-exclamation-circle" aria-hidden="true"></i>
              {{ nameError }}
            </p>
          </div>

          <!-- ======= EMAIL ======= -->
          <div>
            <label for="reg-email" class="mb-1.5 block text-sm font-medium text-ink-700">Email</label>
            <div class="relative">
              <i class="pi pi-envelope absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-ink-400" aria-hidden="true"></i>
              <input
                id="reg-email"
                v-model="email"
                type="email"
                autocomplete="email"
                placeholder="you@example.com"
                class="w-full rounded-lg border bg-white py-2.5 pl-10 pr-4 text-sm text-ink-900 outline-none transition focus:border-primary-400"
                :class="showError('email', emailError) ? 'border-rose-400 focus:border-rose-400' : 'border-ink-200'"
                @blur="touched.email = true"
              />
            </div>
            <p v-if="showError('email', emailError)" class="mt-1.5 flex items-center gap-1 text-sm text-rose-600">
              <i class="pi pi-exclamation-circle" aria-hidden="true"></i>
              {{ emailError }}
            </p>
          </div>

          <!-- ======= PASSWORD ======= -->
          <div>
            <label for="reg-password" class="mb-1.5 block text-sm font-medium text-ink-700">Password</label>
            <div class="relative">
              <i class="pi pi-lock absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-ink-400" aria-hidden="true"></i>
              <input
                id="reg-password"
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                autocomplete="new-password"
                placeholder="At least 8 characters"
                class="w-full rounded-lg border bg-white py-2.5 pl-10 pr-11 text-sm text-ink-900 outline-none transition focus:border-primary-400"
                :class="showError('password', passwordError) ? 'border-rose-400 focus:border-rose-400' : 'border-ink-200'"
                @input="touched.password = true"
              />
              <button
                type="button"
                :aria-label="showPassword ? 'Hide password' : 'Show password'"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-ink-400 transition hover:text-ink-600"
                @click="showPassword = !showPassword"
              >
                <i class="pi text-sm" :class="showPassword ? 'pi-eye-slash' : 'pi-eye'" aria-hidden="true"></i>
              </button>
            </div>
            <p v-if="showError('password', passwordError)" class="mt-1.5 flex items-center gap-1 text-sm text-rose-600">
              <i class="pi pi-exclamation-circle" aria-hidden="true"></i>
              {{ passwordError }}
            </p>
          </div>

          <!-- ======= CONFIRM PASSWORD ======= -->
          <div>
            <label for="reg-confirm" class="mb-1.5 block text-sm font-medium text-ink-700">Confirm password</label>
            <div class="relative">
              <i class="pi pi-check-circle absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-ink-400" aria-hidden="true"></i>
              <input
                id="reg-confirm"
                v-model="confirm"
                :type="showConfirm ? 'text' : 'password'"
                autocomplete="new-password"
                placeholder="Repeat your password"
                class="w-full rounded-lg border bg-white py-2.5 pl-10 pr-11 text-sm text-ink-900 outline-none transition focus:border-primary-400"
                :class="showError('confirm', confirmError) ? 'border-rose-400 focus:border-rose-400' : 'border-ink-200'"
                @input="touched.confirm = true"
              />
              <button
                type="button"
                :aria-label="showConfirm ? 'Hide password' : 'Show password'"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-ink-400 transition hover:text-ink-600"
                @click="showConfirm = !showConfirm"
              >
                <i class="pi text-sm" :class="showConfirm ? 'pi-eye-slash' : 'pi-eye'" aria-hidden="true"></i>
              </button>
            </div>
            <p v-if="showError('confirm', confirmError)" class="mt-1.5 flex items-center gap-1 text-sm text-rose-600">
              <i class="pi pi-exclamation-circle" aria-hidden="true"></i>
              {{ confirmError }}
            </p>
          </div>

          <!-- ======= TERMS ======= -->
          <div>
            <label class="flex cursor-pointer items-start gap-2 text-sm text-ink-500">
              <input
                v-model="terms"
                type="checkbox"
                class="mt-0.5 h-4 w-4 rounded border-ink-300 accent-primary-600"
                @change="touched.terms = true"
              />
              <span>
                I agree to the <a href="#" class="font-medium text-primary-600 hover:text-primary-700">Terms of Service</a>
              </span>
            </label>
            <p v-if="showError('terms', termsError)" class="mt-1.5 flex items-center gap-1 text-sm text-rose-600">
              <i class="pi pi-exclamation-circle" aria-hidden="true"></i>
              {{ termsError }}
            </p>
          </div>

          <button
            type="submit"
            :disabled="submitting"
            class="flex w-full items-center justify-center gap-2 rounded-lg bg-primary-600 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <i class="pi" :class="submitting ? 'pi-spinner pi-spin' : 'pi-user-plus'" aria-hidden="true"></i>
            {{ submitting ? 'Creating account…' : 'Create account' }}
          </button>
        </form>

        <p class="mt-6 text-center text-sm text-ink-500">
          Already have an account?
          <RouterLink to="/login" class="font-semibold text-primary-600 hover:text-primary-700">Sign in</RouterLink>
        </p>
      </div>
    </div>
  </main>
</template>