import { Request, Response } from 'express';
import { registerUser, loginUser, logoutUser,   sendConfirmationCode,
  verifyConfirmationCode, resetPasswordService } from '../services/authService';

export const register = async (req: Request, res: Response) => {
  try {
    const { accountFIO, email, login, status, password, isEmailVerified } = req.body;
    const user = await registerUser(accountFIO, email, login, status, password, isEmailVerified);
    res.status(201).json(user);
  } catch (error) {
    console.error('Error in register controller:', error);
    res.status(500).json({ message: 'Error registering user' });
  }
};

export const signUp = async (req: Request, res: Response) => {
  try {
    const { loginOrEmail, password } = req.body;
    const { token, typeAccess } = await loginUser(loginOrEmail, password);
    res.json({ token, typeAccess });
  } catch (error) {
    console.error('Error in login controller:', error);
    res.status(401).json({ message: 'Неверный логин или пароль' });
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    const accountId = req.user?.primarykey;
    if (!accountId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    await logoutUser(accountId);
    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('Error in logout controller:', error);
    res.status(500).json({ message: 'Error logging out' });
  }
};

export const sendConfirmationCodeController = async (req: Request, res: Response) => {
  try {
    const { email, type } = req.body;
    await sendConfirmationCode(email, type);
    res.json({ success: true });
  } catch (error) {
    console.error('Error sending confirmation code:', error);
    res.status(500).json({ message: error instanceof Error ? error.message : 'Error sending code' });
  }
};

export const verifyConfirmationCodeController = async (req: Request, res: Response) => {
  try {
    const { email, code, type } = req.body;
    const isValid = await verifyConfirmationCode(email, code, type);
    
    if (!isValid) {
      return res.status(400).json({ message: 'Invalid or expired code' });
    }
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error verifying confirmation code:', error);
    res.status(500).json({ message: error instanceof Error ? error.message : 'Error verifying code' });
  }
};


export const resetAccountPassword = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const resetPassword = await resetPasswordService(email, password);
    res.status(200).json({
      success: resetPassword.success,
      message: resetPassword.message,
    });
  } catch (error) {
    console.error('Error in resetAccountPassword:', error);
    res.status(500).json({ message: 'Error reseting password' });
  }
}