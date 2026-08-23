import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../prisma.js';
import { UserPayload } from '../types/index.js';

const JWT_SECRET = process.env.JWT_SECRET || 'credora_default_jwt_secret_2026';

export class AuthService {
  public static generateToken(user: { id: string; email: string; role: string }) {
    return jwt.sign(
      { id: user.id, email: user.email, role: user.role } as UserPayload,
      JWT_SECRET,
      { expiresIn: '7d' }
    );
  }

  public static async register(email: string, password: string, name: string) {
    const existing = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() }
    });

    if (existing) {
      throw new Error('An account with this email already exists.');
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase().trim(),
        passwordHash,
        name: name.trim(),
        profile: {
          create: {
            education: 'B.Tech Computer Science & Engineering',
            degree: 'B.Tech',
            department: 'Computer Science',
            graduationYear: 2026,
            skills: JSON.stringify(['Python', 'JavaScript', 'React', 'SQL', 'Git']),
            interests: JSON.stringify(['Software Engineering', 'Cloud Platforms', 'Web Architecture']),
            careerGoal: 'Full-Stack Software Engineer',
            preferredRoles: JSON.stringify(['Software Engineer Intern', 'Frontend Developer', 'Backend Developer']),
            preferredIndustries: JSON.stringify(['Technology', 'Fintech', 'AI / SaaS']),
            preferredLocations: JSON.stringify(['Bangalore', 'Hyderabad', 'Remote']),
            workMode: 'HYBRID',
            onboardingCompleted: true
          }
        },
        preferences: {
          create: {
            theme: 'DARK',
            emailAlerts: true,
            riskWarningAlerts: true
          }
        }
      },
      include: {
        profile: true,
        preferences: true
      }
    });

    const token = this.generateToken(user);
    return { user, token };
  }

  public static async login(email: string, password: string) {
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
      include: {
        profile: true,
        preferences: true
      }
    });

    if (!user) {
      throw new Error('Invalid email or password.');
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      throw new Error('Invalid email or password.');
    }

    const token = this.generateToken(user);
    return { user, token };
  }

  public static async getCurrentUser(userId: string) {
    return prisma.user.findUnique({
      where: { id: userId },
      include: {
        profile: true,
        preferences: true
      }
    });
  }

  public static async updateProfile(userId: string, data: any) {
    const profile = await prisma.candidateProfile.upsert({
      where: { userId },
      update: {
        education: data.education,
        degree: data.degree,
        department: data.department,
        college: data.college,
        graduationYear: data.graduationYear ? parseInt(data.graduationYear) : undefined,
        skills: Array.isArray(data.skills) ? JSON.stringify(data.skills) : data.skills,
        interests: Array.isArray(data.interests) ? JSON.stringify(data.interests) : data.interests,
        careerGoal: data.careerGoal,
        preferredRoles: Array.isArray(data.preferredRoles) ? JSON.stringify(data.preferredRoles) : data.preferredRoles,
        preferredIndustries: Array.isArray(data.preferredIndustries) ? JSON.stringify(data.preferredIndustries) : data.preferredIndustries,
        preferredLocations: Array.isArray(data.preferredLocations) ? JSON.stringify(data.preferredLocations) : data.preferredLocations,
        workMode: data.workMode,
        bio: data.bio,
        onboardingCompleted: true
      },
      create: {
        userId,
        education: data.education || 'B.Tech CSE',
        degree: data.degree || 'B.Tech',
        department: data.department || 'CSE',
        college: data.college,
        graduationYear: data.graduationYear ? parseInt(data.graduationYear) : 2026,
        skills: Array.isArray(data.skills) ? JSON.stringify(data.skills) : JSON.stringify(['Python', 'React']),
        interests: Array.isArray(data.interests) ? JSON.stringify(data.interests) : JSON.stringify(['Software Engineering']),
        careerGoal: data.careerGoal || 'Software Engineer',
        preferredRoles: Array.isArray(data.preferredRoles) ? JSON.stringify(data.preferredRoles) : JSON.stringify(['Software Intern']),
        preferredIndustries: Array.isArray(data.preferredIndustries) ? JSON.stringify(data.preferredIndustries) : JSON.stringify(['Technology']),
        preferredLocations: Array.isArray(data.preferredLocations) ? JSON.stringify(data.preferredLocations) : JSON.stringify(['Bangalore']),
        workMode: data.workMode || 'HYBRID',
        bio: data.bio,
        onboardingCompleted: true
      }
    });

    if (data.name) {
      await prisma.user.update({
        where: { id: userId },
        data: { name: data.name }
      });
    }

    return profile;
  }
}
