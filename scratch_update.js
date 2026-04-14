const fs = require('fs');
const file = 'c:/Users/박도현/Desktop/looky-dashboard/looky-api.json';
const data = JSON.parse(fs.readFileSync(file, 'utf8'));

if (data.paths['/api/admin/universities']) {
    data.paths['/api/admin/universities'].get = {
        tags: ['Admin University Controller'],
        summary: '[관리자] 대학 전체 목록 조회',
        operationId: 'getUniversities_Admin', // unique id
        responses: {
            '200': {
                description: '조회 성공',
                content: {
                    'application/json': {
                        schema: {
                            $ref: '#/components/schemas/CommonResponseListUniversityResponse'
                        }
                    }
                }
            }
        }
    };
}

if (!data.paths['/api/admin/universities/{universityId}']) {
    data.paths['/api/admin/universities/{universityId}'] = {};
}
data.paths['/api/admin/universities/{universityId}'].get = {
    tags: ['Admin University Controller'],
    summary: '[관리자] 대학 단건 조회',
    operationId: 'getUniversity_Admin',
    parameters: [{
        name: 'universityId',
        in: 'path',
        required: true,
        schema: {
            type: 'integer',
            format: 'int64'
        }
    }],
    responses: {
        '200': {
            description: '조회 성공',
            content: {
                'application/json': {
                    schema: {
                        $ref: '#/components/schemas/UniversityResponse' // Just use UniversityResponse
                    }
                }
            }
        }
    }
};
fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf8');
