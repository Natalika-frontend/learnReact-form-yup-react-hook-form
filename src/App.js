import { useForm } from "react-hook-form";
import * as yup from 'yup';
import { yupResolver } from "@hookform/resolvers/yup";
import styles from './App.module.css';
import { useEffect, useRef } from "react";

const sendFormData = (formData) => {
	console.log(formData)
};

const fieldsSchema = yup.object()
	.shape({
		email: yup.string()
			.required('Поле email обязательно для заполнения')
			.matches(/^[A-Z0-9._%+-]+@[A-Z0-9-]+\.[A-Z]{2,}$/i, 'Некорректный email. Ведите почту в формате: yorPostAddress@mail.ru'),
		password: yup.string()
			.required('Поле пароля обязательно для заполнения')
			.min(3, 'Некорректый пароль. Пароль должен содержать не менее 3 символов')
			.max(8, 'Некорректый пароль. Пароль должен содержать не более 8 символов'),
		repeatPassword: yup.string()
			.required('Повторите пароль')
			.oneOf([yup.ref('password'), null], 'Пароли должны совпадать')
	});

export const App = () => {
	const {
		register,
		handleSubmit,
		formState: {isDirty, isValid, errors, },
		setValue,
		trigger,
	} = useForm({
		defaultValues: {
			email: '',
			password: '',
			repeatPassword: '',
		},
		resolver: yupResolver(fieldsSchema),
	});

	const emailError = errors.email?.message;
	const passwordError = errors.password?.message;
	const repeatPasswordError = errors.repeatPassword?.message;

	const submitButtonRef = useRef(null);

	useEffect(() => {
		if (isValid) {
			submitButtonRef.current.focus();
		}
	}, [isValid]);

	const handleBlur = async (fieldName, value) => {
		await setValue(fieldName, value);
		await trigger(fieldName);
	};

	return (
		<div className={styles.app}>
			<form className={styles.form} onSubmit={handleSubmit(sendFormData)} autoComplete="off">
				<label className={styles.label}>Форма регистрации</label>
				{emailError && <div className={styles.errorLabel}>{emailError}</div>}
				<input className={styles.item}
					   type="email"
					   placeholder="Введите email"
					   {...register('email')}
					   onBlur={(e) => handleBlur('email', e.target.value)}
				/>
				{passwordError && <div className={styles.errorLabel}>{passwordError}</div>}
				<input
					className={styles.item}
					type="password"
					placeholder="Введите пароль"
					{...register('password')}
					onBlur={(e) => handleBlur('password', e.target.value)}
				/>
				{repeatPasswordError && <div className={styles.errorLabel}>{repeatPasswordError}</div>}
				<input
					className={styles.item}
					name="repeatPassword"
					type="password"
					placeholder="Повторите ваш пароль"
					{...register('repeatPassword')}
					onBlur={(e) => handleBlur('repeatPassword', e.target.value)}
				/>
				<button className={styles.btn} ref={submitButtonRef} type="submit"
						disabled={!isDirty || !isValid}>Зарегистрироваться
				</button>
			</form>
		</div>
	);
};
