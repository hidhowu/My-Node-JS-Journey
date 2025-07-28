// This modules replace html placeholders with actual content
module.exports = function (template, usersData) {

    let output = template.replace('{{ID}}', usersData.id);
    output = output.replace('{{NAME}}', usersData.name);
    output = output.replace('{{EMAIL}}', usersData.email);
    output = output.replace('{{ROLE}}', usersData.role);

    return output;
}