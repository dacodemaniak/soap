/**
 * @name FamilyCompositionInterface Définition de la composition familiale
 * @author IDea Factory (dev-team@ideafactory.fr) - Sept. 2018
 * @package shared/interfaces
 * @version 1.0.0
 */
export interface FamilyCompositionInterface {
  /**
   * Type de personnes Adulte, Enfant, Adolescent, Senior
   */
  type: string;

  /**
   * Nombre
   */
  members: number;
}
