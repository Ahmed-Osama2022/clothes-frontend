<script setup>
import { computed, reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import { useToastStore } from '../stores/toast';

// ======= REGISTER PAGE (route: /register) =======
// Realtime validation (errors as you type) + toasts for success/error.
// Register calls src/api/auth.js (axios client prepared for Laravel + Sanctum).
// All labels/errors are UI chrome -> translated via i18n (auth.* keys).
const { t } = useI18n();
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
  if (!fullName.value) return t('auth.nameRequired');
  return fullName.value.trim().length < 2 ? t('auth.nameMin') : '';
});
const emailError = computed(() => {
  if (!email.value) return t('auth.emailRequired');
  return isEmail(email.value) ? '' : t('auth.emailInvalid');
});
const passwordError = computed(() => {
  if (!password.value) return t('auth.passwordRequired');
  if (password.value.length < 8) return t('auth.passwordMin8');
  if (!/[a-zA-Z]/.test(password.value) || !/\d/.test(password.value)) return t('auth.passwordMix');
  return '';
});
const confirmError = computed(() => {
  if (!confirm.value) return t('auth.confirmRequired');
  return confirm.value === password.value ? '' : t('auth.confirmMismatch');
});
const termsError = computed(() => (terms.value ? '' : t('auth.termsRequired')));

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
    toast.error(t('auth.fixFields'));
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
    toast.success(t('auth.welcomeAboard'));
    router.push('/login');
  } catch (error) {
    toast.error(error.message || t('auth.registrationFailed'));
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
            <h1 class="text-2xl font-bold text-ink-900">{{ $t('auth.createAccount') }}</h1>
            <p class="text-sm text-ink-500">{{ $t('auth.joinPrompt') }}</p>
          </div>
        </div>

        <form class="mt-8 space-y-5" novalidate @submit.prevent="handleSubmit">
          <!-- ======= FULL NAME ======= -->
          <div>
            <label for="reg-name" class="mb-1.5 block text-sm font-medium text-ink-700">{{ $t('auth.fullName') }}</label>
            <div class="relative">
              <i class="pi pi-user absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-ink-400" aria-hidden="true"></i>
              <input
                id="reg-name"
                v-model="fullName"
                type="text"
                autocomplete="name"
                :placeholder="$t('auth.namePlaceholder')"
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
            <label for="reg-email" class="mb-1.5 block text-sm font-medium text-ink-700">{{ $t('auth.email') }}</label>
            <div class="relative">
              <i class="pi pi-envelope absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-ink-400" aria-hidden="true"></i>
              <input
                id="reg-email"
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
            <label for="reg-password" class="mb-1.5 block text-sm font-medium text-ink-700">{{ $t('auth.password') }}</label>
            <div class="relative">
              <i class="pi pi-lock absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-ink-400" aria-hidden="true"></i>
              <input
                id="reg-password"
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                autocomplete="new-password"
                :placeholder="$t('auth.passwordPlaceholder')"
                class="w-full rounded-lg border bg-white py-2.5 pl-10 pr-11 text-sm text-ink-900 outline-none transition focus:border-primary-400"
                :class="showError('password', passwordError) ? 'border-rose-400 focus:border-rose-400' : 'border-ink-200'"
                @input="touched.password = true"
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

          <!-- ======= CONFIRM PASSWORD ======= -->
          <div>
            <label for="reg-confirm" class="mb-1.5 block text-sm font-medium text-ink-700">{{ $t('auth.confirmPassword') }}</label>
            <div class="relative">
              <i class="pi pi-check-circle absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-ink-400" aria-hidden="true"></i>
              <input
                id="reg-confirm"
                v-model="confirm"
                :type="showConfirm ? 'text' : 'password'"
                autocomplete="new-password"
                :placeholder="$t('auth.repeatPassword')"
                class="w-full rounded-lg border bg-white py-2.5 pl-10 pr-11 text-sm text-ink-900 outline-none transition focus:border-primary-400"
                :class="showError('confirm', confirmError) ? 'border-rose-400 focus:border-rose-400' : 'border-ink-200'"
                @input="touched.confirm = true"
              />
              <button
                type="button"
                :aria-label="showConfirm ? $t('auth.hidePassword') : $t('auth.showPassword')"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-ink-400 transition duration-200 hover:text-ink-600 active:scale-90"
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
                {{ $t('auth.agreeTerms') }}
                <a href="#" class="font-medium text-primary-600 hover:text-primary-700">{{ $t('auth.termsOfService') }}</a>
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
            class="flex w-full items-center justify-center gap-2 rounded-lg bg-primary-600 py-2.5 text-sm font-semibold text-white shadow-sm transition duration-200 hover:bg-primary-700 active:scale-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <i class="pi" :class="submitting ? 'pi-spinner pi-spin' : 'pi-user-plus'" aria-hidden="true"></i>
            {{ submitting ? $t('auth.creatingAccount') : $t('auth.createAccount') }}
          </button>
        </form>

        <p class="mt-6 text-center text-sm text-ink-500">
          {{ $t('auth.hasAccount') }}
          <RouterLink to="/login" class="font-semibold text-primary-600 hover:text-primary-700">{{ $t('auth.signInLink') }}</RouterLink>
        </p>
      </div>
    </div>
  </main>
</template>