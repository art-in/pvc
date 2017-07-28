import clone from '../clone';
import removeFromArray from '../remove-from-array';

/**
 * Builds object tree structure from plain collection of project
 * @param {object} projectsData 
 * @return {object} root project
 */
export default function buildTree(projectsData) {
    
    // deep copy projects to not modify them
    const projects = clone(projectsData).projects.project;

    const rootProj = projects.find(p => p.id === '_Root');
    if (!rootProj) {
        throw Error('No root project found');
    }

    return extractChildProjects(projects, rootProj);
}

/**
 * Recursively extracts child projects from array
 * and assigns them to passed parent project
 * @param {array} projects 
 * @param {object} parentProject 
 * @return {object} parent project
 */
function extractChildProjects(projects, parentProject) {
    if (projects.length === 0) {
        return;
    }

    const childProjects = projects
        .filter(p => p.parentProjectId === parentProject.id);
    
    parentProject.childProjects = childProjects;
    childProjects.forEach(p => removeFromArray(projects, p));
    childProjects.forEach(p => extractChildProjects(projects, p));

    return parentProject;
}