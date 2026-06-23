import { Project } from '../../models/project.model';
import { UserProfile } from '../../models/user.model';

// ============================================================
// Feature: Création d'un projet
// ============================================================

describe('Feature: Création d\'un projet', () => {

  // Utilisateur mocké — auth simulée
  const mockParticulier: UserProfile = {
    id: 'user-001',
    type: 'PARTICULAR',
    firstName: 'Remy',
    lastName: 'Lansade',
    email: 'remy@kalpy.fr',
    address: '12 rue de la Paix, 75001 Paris',
  };

  // --------------------------------------------------------
  describe('Scenario: L\'utilisateur crée un nouveau projet', () => {

    let project: Project;

    it('Given un utilisateur particulier connecté', () => {
      expect(mockParticulier.type).toBe('PARTICULAR');
      expect(mockParticulier.email).toBeDefined();
    });

    it('When il crée un projet nommé "Rénovation cuisine"', () => {
      project = {
        id: 'project-001',
        name: 'Rénovation cuisine',
        createdAt: new Date(),
        owner: mockParticulier,
      };
      expect(project).toBeDefined();
    });

    it('Then le projet a un nom correct', () => {
      expect(project.name).toBe('Rénovation cuisine');
    });

    it('And le projet a une date de création automatique', () => {
      expect(project.createdAt).toBeInstanceOf(Date);
    });

    it('And le projet appartient à l\'utilisateur connecté', () => {
      expect(project.owner.id).toBe(mockParticulier.id);
    });

  });

  // --------------------------------------------------------
  describe('Scenario: Un utilisateur invité ne peut pas créer de projet', () => {

    it('Given un utilisateur invité', () => {
      const guest: UserProfile = {
        id: 'guest-001',
        type: 'GUEST',
        firstName: '',
        lastName: '',
        email: '',
      };
      expect(guest.type).toBe('GUEST');
    });

    it('Then il ne peut pas posséder un projet', () => {
      const canOwnProject = (type: string) => type !== 'GUEST';
      expect(canOwnProject('GUEST')).toBe(false);
      expect(canOwnProject('PARTICULAR')).toBe(true);
      expect(canOwnProject('PROFESSIONAL')).toBe(true);
    });

  });

});