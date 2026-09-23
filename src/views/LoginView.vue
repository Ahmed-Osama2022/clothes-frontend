<script setup>
import { computed, reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import { useToastStore } from '../stores/toast';

// ======= LOGIN PAGE (route: /login) =======
// Realtime validation: errors appear as the user types/blurs a field.
// Submit calls src/api/auth.js (axios client prepared for Laravel + Sanctum).
// All labels/errors are UI chrome -> translated via i18n (auth.* keys).
const { t } = useI18n();
const router = useRouter();
const auth = useAuthStore();
const toast = useToastStore();

const email = ref('');
const password = ref('');
const showPassword = ref(false);
const submitting = ref(false);
// Fields the user already touched/attempted -> show their errors live.
const touched = reactive({ email: false, password: false });

const isEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

const emailError = computed(() => {
  if (!email.value) return t('auth.emailRequired');
  return isEmail(email.value) ? '' : t('auth.emailInvalid');
});
const passwordError = computed(() => {
  if (!password.value) return t('auth.passwordRequired');
  return password.value.length < 6 ? t('auth.passwordMin') : '';
});

const hasErrors = computed(() => Boolean(emailError.value || passwordError.value));

// Show highlight + message only once the field was touched (not on first load).
const showError = (field, errorText) => touched[field] && errorText;

const handleSubmit = async () => {
  touched.email = true;
  touched.password = true;
  if (hasErrors.value) {
    toast.error(t('auth.fixFields'));
    return;
  }

  submitting.value = true;
  try {
    // Backend not running yet — this will resolve as soon as the Laravel API
    // answers on the host from .env (see src/api/client.js).
    await auth.login({ email: email.value, password: password.value });
    toast.success(t('auth.welcomeBackToast', { name: auth.userName || ' ' }));
    router.push('/');
  } catch (error) {
    toast.error(error.message || t('auth.loginFailed'));
  } finally {
    submitting.value = false;
  }
};
</script>

<template>
  <!-- ======= LOGIN FORM ======= -->
  <main class="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-snow-100 px-4 py-12">
    <div class="w-full max-w-md" data-aos="fade-up">
      <div class="rounded-2xl bg-white p-8 shadow-sm">
        <div class="flex items-center gap-3">
          <span class="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-100 text-primary-600">
            <i class="pi pi-user" aria-hidden="true"></i>
          </span>
          <div>
            <h1 class="text-2xl font-bold text-ink-900">{{ $t('auth.welcomeBack') }}</h1>
            <p class="text-sm text-ink-500">{{ $t('auth.signInPrompt') }}</p>
          </div>
        </div>

        <form class="mt-8 space-y-5" novalidate @submit.prevent="handleSubmit">
          <!-- ======= EMAIL ======= -->
          <div>
            <label for="login-email" class="mb-1.5 block text-sm font-medium text-ink-700">{{ $t('auth.email') }}</label>
            <div class="relative">
              <i class="pi pi-envelope absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-ink-400" aria-hidden="true"></i>
              <input
                id="login-email"
                v-model="email"
                type="email"
                autocomplete="email"
                :placeholder="$t('auth.emailPlaceholder')"
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
            <label for="login-password" class="mb-1.5 block text-sm font-medium text-ink-700">{{ $t('auth.password') }}</label>
            <div class="relative">
              <i class="pi pi-lock absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-ink-400" aria-hidden="true"></i>
              <input
                id="login-password"
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                autocomplete="current-password"
                placeholder="••••••••"
                class="w-full rounded-lg border bg-white py-2.5 pl-10 pr-11 text-sm text-ink-900 outline-none transition focus:border-primary-400"
                :class="showError('password', passwordError) ? 'border-rose-400 focus:border-rose-400' : 'border-ink-200'"
                @blur="touched.password = true"
              />
              <button
                type="button"
                :aria-label="showPassword ? $t('auth.hidePassword') : $t('auth.showPassword')"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-ink-400 transition duration-200 hover:text-ink-600 active:scale-90"
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

          <button
            type="submit"
            :disabled="submitting"
            class="flex w-full items-center justify-center gap-2 rounded-lg bg-primary-600 py-2.5 text-sm font-semibold text-white shadow-sm transition duration-200 hover:bg-primary-700 active:scale-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <i class="pi" :class="submitting ? 'pi-spinner pi-spin' : 'pi-sign-in'" aria-hidden="true"></i>
            {{ submitting ? $t('auth.signingIn') : $t('auth.signIn') }}
          </button>
        </form>

        <p class="mt-6 text-center text-sm text-ink-500">
          {{ $t('auth.noAccount') }}
          <RouterLink to="/register" class="font-semibold text-primary-600 hover:text-primary-700">{{ $t('auth.createOne') }}</RouterLink>
        </p>
      </div>
    </div>
  </main>
</template>