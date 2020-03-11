import { TestBed } from '@angular/core/testing';

import { TestHCPs } from '../../../test/support/test-hcps';
import { AuthenticationService } from '@lib/authentication/authentication.service';
import { LocaliseModule } from '@lib/localise/localise.module';
import { UserModule } from '../user.module';
import { EditUserRestService } from './edit-user-rest.service';
import { EditUserService, UserEdit } from './edit-user.service';
import { of } from 'rxjs';

describe('EditUserService', () => {
    let editUserService: EditUserService;
    configureTestSuite(() => {
        TestBed.configureTestingModule({
            imports: [UserModule, LocaliseModule],
            providers: [
                EditUserService,
                {
                    provide: EditUserRestService,
                    useValue: {
                        patch: (id, user) => of({ message: 'success' }),
                    },
                },
            ],
        });
    });

    beforeEach(() => (editUserService = TestBed.get(EditUserService)));

    it('should edit user data', done => {
        const userEdit: UserEdit = {
            backendId: '1',
            firstName: 'firstName',
            lastName: 'lastName',
            phoneNumber: 'phoneNumber',
            role: 'role',
            gender: 'male',
            units: 'metric',
            language: 'en',
            dateFormat: 'dd/MM/yyyy',
            firstDayOfWeek: 'tuesday',
        };
        spyOn(AuthenticationService, 'getUser').and.returnValue(
            TestHCPs.createDrCollins(),
        );
        spyOn(AuthenticationService, 'setUser');
        editUserService.userData.subscribe(editedUser => {
            expect(editedUser.firstName).toBe(userEdit.firstName);
            done();
        });
        editUserService.editUserData(userEdit).subscribe();
    });
});
